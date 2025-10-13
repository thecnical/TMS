const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      priority, 
      assignedTo, 
      project,
      dueDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = { isArchived: false };
    
    // Filter by projects user has access to
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).select('_id');
    
    const projectIds = userProjects.map(p => p._id);
    query.project = { $in: projectIds };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (project) query.project = project;
    
    if (dueDate) {
      const date = new Date(dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color members owner')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('comments.user', 'name email avatar')
      .populate('watchers', 'name email avatar')
      .populate('dependencies.task', 'title status priority')
      .populate('timeTracking.user', 'name avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    const project = task.project;
    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      title,
      description,
      project,
      assignedTo,
      priority = 'medium',
      category = 'other',
      dueDate,
      estimatedHours,
      tags = [],
      subtasks = []
    } = req.body;

    // Check if user has access to the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = req.user.role === 'admin' || 
                     projectDoc.owner.toString() === req.user._id.toString() ||
                     projectDoc.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      priority,
      category,
      dueDate,
      estimatedHours,
      tags,
      subtasks,
      watchers: [req.user._id] // Creator automatically watches the task
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      task: populatedTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().isLength({ max: 2000 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const task = await Task.findById(req.params.id).populate('project');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to update this task
    const project = task.project;
    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString()) ||
                     task.assignedTo?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      description,
      status,
      priority,
      category,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours,
      progress,
      tags,
      subtasks,
      labels
    } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.category = category || task.category;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.estimatedHours = estimatedHours !== undefined ? estimatedHours : task.estimatedHours;
    task.actualHours = actualHours !== undefined ? actualHours : task.actualHours;
    task.progress = progress !== undefined ? progress : task.progress;
    task.tags = tags || task.tags;
    task.subtasks = subtasks || task.subtasks;
    task.labels = labels || task.labels;

    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json({
      task: populatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user can delete this task
    const project = task.project;
    const canDelete = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     task.createdBy.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
router.post('/:id/comments', protect, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { content, attachments = [] } = req.body;
    
    const task = await Task.findById(req.params.id).populate('project');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to comment on this task
    const project = task.project;
    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.addComment(req.user._id, content, attachments);
    
    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email avatar');

    res.json({
      comments: updatedTask.comments,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @desc    Add time tracking entry
// @route   POST /api/tasks/:id/time
// @access  Private
router.post('/:id/time', protect, [
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { duration, description, date } = req.body;
    
    const task = await Task.findById(req.params.id).populate('project');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to track time on this task
    const project = task.project;
    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString()) ||
                     task.assignedTo?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.timeTracking.push({
      user: req.user._id,
      duration: parseInt(duration),
      description,
      date: date || new Date()
    });

    // Update actual hours
    task.actualHours = task.getTotalTimeSpent() / 60; // Convert minutes to hours

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('timeTracking.user', 'name avatar');

    res.json({
      timeTracking: populatedTask.timeTracking,
      actualHours: populatedTask.actualHours,
      message: 'Time entry added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding time entry' });
  }
});

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const { status, assignedTo, priority } = req.query;
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = { project: req.params.projectId, isArchived: false };
    
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching project tasks' });
  }
});

// @desc    Update task positions (for drag and drop)
// @route   PUT /api/tasks/reorder
// @access  Private
router.put('/reorder', protect, [
  body('tasks').isArray().withMessage('Tasks must be an array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { tasks } = req.body;

    // Update positions
    const updatePromises = tasks.map((task, index) => 
      Task.findByIdAndUpdate(task._id, { position: index })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Task positions updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task positions' });
  }
});

module.exports = router;