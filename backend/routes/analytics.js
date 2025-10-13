const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Manager/Admin)
router.get('/dashboard', protect, managerOrAdmin, async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get projects user has access to
    let projectQuery = {};
    if (req.user.role !== 'admin') {
      projectQuery = {
        $or: [
          { owner: req.user._id },
          { 'members.user': req.user._id }
        ]
      };
    }

    const userProjects = await Project.find(projectQuery).select('_id');
    const projectIds = userProjects.map(p => p._id);

    const [
      totalStats,
      taskStatusStats,
      taskPriorityStats,
      projectStatusStats,
      recentActivity,
      productivityStats,
      userPerformance,
      overdueStats
    ] = await Promise.all([
      // Total counts
      Promise.all([
        Task.countDocuments({ project: { $in: projectIds } }),
        Project.countDocuments(projectQuery),
        User.countDocuments({ isActive: true }),
        Task.countDocuments({ 
          project: { $in: projectIds }, 
          status: 'completed',
          completedAt: { $gte: startDate }
        })
      ]),

      // Task status distribution
      Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Task priority distribution
      Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),

      // Project status distribution
      Project.aggregate([
        { $match: projectQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Recent activity (tasks completed in the last 7 days)
      Task.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            status: 'completed',
            completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$completedAt' },
              month: { $month: '$completedAt' },
              day: { $dayOfMonth: '$completedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Productivity stats (tasks completed vs created)
      Task.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            created: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'completed'] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // User performance
      Task.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            assignedTo: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$assignedTo',
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            averageProgress: { $avg: '$progress' },
            totalTimeSpent: { $sum: '$actualHours' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            user: {
              _id: '$user._id',
              name: '$user.name',
              email: '$user.email',
              avatar: '$user.avatar'
            },
            totalTasks: 1,
            completedTasks: 1,
            completionRate: {
              $multiply: [
                { $divide: ['$completedTasks', '$totalTasks'] },
                100
              ]
            },
            averageProgress: { $round: ['$averageProgress', 2] },
            totalTimeSpent: { $round: ['$totalTimeSpent', 2] }
          }
        },
        { $sort: { completionRate: -1 } },
        { $limit: 10 }
      ]),

      // Overdue tasks stats
      Task.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
          }
        },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const [totalTasks, totalProjects, totalUsers, completedThisPeriod] = totalStats;

    res.json({
      summary: {
        totalTasks,
        totalProjects,
        totalUsers,
        completedThisPeriod
      },
      taskStatusStats: taskStatusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      taskPriorityStats: taskPriorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      projectStatusStats: projectStatusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentActivity,
      productivityStats,
      userPerformance,
      overdueStats: overdueStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @desc    Get project analytics
// @route   GET /api/analytics/project/:id
// @access  Private
router.get('/project/:id', protect, async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Check if user has access to this project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const analytics = await project.getAnalytics();

    // Additional project-specific analytics
    const [
      taskTrends,
      memberContributions,
      timeTracking,
      burndownData
    ] = await Promise.all([
      // Task creation and completion trends
      Task.aggregate([
        { $match: { project: project._id } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              week: { $week: '$createdAt' }
            },
            created: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'completed'] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
      ]),

      // Member contributions
      Task.aggregate([
        { $match: { project: project._id } },
        {
          $group: {
            _id: '$assignedTo',
            tasksAssigned: { $sum: 1 },
            tasksCompleted: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            totalTimeSpent: {
              $sum: {
                $reduce: {
                  input: '$timeTracking',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.duration'] }
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
      ]),

      // Time tracking summary
      Task.aggregate([
        { $match: { project: project._id } },
        { $unwind: { path: '$timeTracking', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: {
              year: { $year: '$timeTracking.date' },
              month: { $month: '$timeTracking.date' },
              day: { $dayOfMonth: '$timeTracking.date' }
            },
            totalMinutes: { $sum: '$timeTracking.duration' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Burndown chart data
      Task.aggregate([
        { $match: { project: project._id } },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            estimatedHours: { $sum: '$estimatedHours' },
            actualHours: { $sum: '$actualHours' }
          }
        }
      ])
    ]);

    res.json({
      ...analytics,
      taskTrends,
      memberContributions,
      timeTracking,
      burndownData: burndownData[0] || {
        totalTasks: 0,
        completedTasks: 0,
        estimatedHours: 0,
        actualHours: 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching project analytics' });
  }
});

// @desc    Get user analytics
// @route   GET /api/analytics/user/:id
// @access  Private
router.get('/user/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can access this analytics
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [
      taskStats,
      productivityTrends,
      timeSpentByProject,
      recentActivity
    ] = await Promise.all([
      // Task statistics
      Task.aggregate([
        { $match: { assignedTo: user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            averageProgress: { $avg: '$progress' },
            totalEstimatedHours: { $sum: '$estimatedHours' },
            totalActualHours: { $sum: '$actualHours' }
          }
        }
      ]),

      // Productivity trends (last 30 days)
      Task.aggregate([
        {
          $match: {
            assignedTo: user._id,
            updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$updatedAt' },
              month: { $month: '$updatedAt' },
              day: { $dayOfMonth: '$updatedAt' }
            },
            tasksUpdated: { $sum: 1 },
            tasksCompleted: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Time spent by project
      Task.aggregate([
        { $match: { assignedTo: user._id } },
        {
          $group: {
            _id: '$project',
            totalHours: { $sum: '$actualHours' },
            taskCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: '_id',
            as: 'project'
          }
        },
        { $unwind: '$project' },
        {
          $project: {
            project: {
              _id: '$project._id',
              name: '$project.name',
              color: '$project.color'
            },
            totalHours: { $round: ['$totalHours', 2] },
            taskCount: 1
          }
        },
        { $sort: { totalHours: -1 } }
      ]),

      // Recent activity
      Task.find({
        assignedTo: user._id,
        updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
        .populate('project', 'name color')
        .sort({ updatedAt: -1 })
        .limit(10)
    ]);

    res.json({
      taskStats: taskStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          averageProgress: Math.round(stat.averageProgress || 0),
          totalEstimatedHours: stat.totalEstimatedHours,
          totalActualHours: stat.totalActualHours
        };
        return acc;
      }, {}),
      productivityTrends,
      timeSpentByProject,
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user analytics' });
  }
});

// @desc    Get team performance analytics
// @route   GET /api/analytics/team
// @access  Private (Manager/Admin)
router.get('/team', protect, managerOrAdmin, async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      teamProductivity,
      collaborationStats,
      workloadDistribution
    ] = await Promise.all([
      // Team productivity metrics
      User.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'tasks',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$assignedTo', '$$userId'] },
                  updatedAt: { $gte: startDate }
                }
              }
            ],
            as: 'tasks'
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            avatar: 1,
            role: 1,
            totalTasks: { $size: '$tasks' },
            completedTasks: {
              $size: {
                $filter: {
                  input: '$tasks',
                  cond: { $eq: ['$$this.status', 'completed'] }
                }
              }
            },
            averageProgress: { $avg: '$tasks.progress' },
            totalTimeSpent: { $sum: '$tasks.actualHours' }
          }
        },
        {
          $addFields: {
            completionRate: {
              $cond: [
                { $eq: ['$totalTasks', 0] },
                0,
                { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }
              ]
            }
          }
        },
        { $sort: { completionRate: -1 } }
      ]),

      // Collaboration statistics
      Task.aggregate([
        {
          $match: {
            updatedAt: { $gte: startDate },
            'comments.0': { $exists: true }
          }
        },
        {
          $project: {
            project: 1,
            assignedTo: 1,
            commentCount: { $size: '$comments' },
            uniqueCommenters: {
              $size: {
                $setUnion: ['$comments.user', []]
              }
            }
          }
        },
        {
          $group: {
            _id: '$project',
            totalComments: { $sum: '$commentCount' },
            averageCollaboration: { $avg: '$uniqueCommenters' },
            taskCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: '_id',
            as: 'project'
          }
        },
        { $unwind: '$project' },
        { $sort: { totalComments: -1 } },
        { $limit: 10 }
      ]),

      // Workload distribution
      Task.aggregate([
        {
          $match: {
            assignedTo: { $exists: true },
            status: { $ne: 'completed' }
          }
        },
        {
          $group: {
            _id: '$assignedTo',
            activeTasks: { $sum: 1 },
            totalEstimatedHours: { $sum: '$estimatedHours' },
            averagePriority: {
              $avg: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$priority', 'low'] }, then: 1 },
                    { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                    { case: { $eq: ['$priority', 'high'] }, then: 3 },
                    { case: { $eq: ['$priority', 'urgent'] }, then: 4 }
                  ],
                  default: 2
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            user: {
              _id: '$user._id',
              name: '$user.name',
              avatar: '$user.avatar'
            },
            activeTasks: 1,
            totalEstimatedHours: { $round: ['$totalEstimatedHours', 2] },
            workloadScore: {
              $multiply: ['$activeTasks', '$averagePriority']
            }
          }
        },
        { $sort: { workloadScore: -1 } }
      ])
    ]);

    res.json({
      teamProductivity,
      collaborationStats,
      workloadDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching team analytics' });
  }
});

module.exports = router;