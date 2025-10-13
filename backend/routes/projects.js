const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority } = req.query;
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admin can see all projects
    } else {
      // Others can only see projects they own or are members of
      query.$or = [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ];
    }
    
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      });
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    query.isArchived = false;

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        await project.calculateProgress();
        return project;
      })
    );

    const total = await Project.countDocuments(query);

    res.json({
      projects: projectsWithProgress,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members.user', 'name email avatar role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const hasAccess = req.user.role === 'admin' || 
                     project.owner._id.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await project.calculateProgress();
    const analytics = await project.getAnalytics();

    res.json({ project, analytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Manager/Admin)
router.post('/', protect, managerOrAdmin, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2 and 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
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
      name,
      description,
      members = [],
      priority = 'medium',
      startDate,
      endDate,
      deadline,
      tags = [],
      color = '#3B82F6',
      budget
    } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: members.map(memberId => ({ user: memberId })),
      priority,
      startDate: startDate || new Date(),
      endDate,
      deadline,
      tags,
      color,
      budget
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.status(201).json({
      project: populatedProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner/Admin)
router.put('/:id', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().isLength({ max: 1000 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user can update this project
    const canUpdate = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      deadline,
      tags,
      color,
      budget,
      settings
    } = req.body;

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.priority = priority || project.priority;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.deadline = deadline || project.deadline;
    project.tags = tags || project.tags;
    project.color = color || project.color;
    project.budget = budget || project.budget;
    project.settings = settings || project.settings;

    const updatedProject = await project.save();
    
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      project: populatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user can delete this project
    const canDelete = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Owner/Admin)
router.post('/:id/members', protect, [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('role').optional().isIn(['admin', 'manager', 'member']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { userId, role = 'member' } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user can add members
    const canAddMembers = req.user.role === 'admin' || 
                         project.owner.toString() === req.user._id.toString();

    if (!canAddMembers) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user is already a member
    const existingMember = project.members.find(
      member => member.user.toString() === userId
    );

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push({ user: userId, role });
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      project: populatedProject,
      message: 'Member added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding member' });
  }
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Owner/Admin)
router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user can remove members
    const canRemoveMembers = req.user.role === 'admin' || 
                            project.owner.toString() === req.user._id.toString();

    if (!canRemoveMembers) {
      return res.status(403).json({ message: 'Access denied' });
    }

    project.members = project.members.filter(
      member => member.user.toString() !== req.params.userId
    );

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      project: populatedProject,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing member' });
  }
});

// @desc    Archive/Unarchive project
// @route   PUT /api/projects/:id/archive
// @access  Private (Owner/Admin)
router.put('/:id/archive', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user can archive this project
    const canArchive = req.user.role === 'admin' || 
                      project.owner.toString() === req.user._id.toString();

    if (!canArchive) {
      return res.status(403).json({ message: 'Access denied' });
    }

    project.isArchived = !project.isArchived;
    await project.save();

    res.json({
      project,
      message: `Project ${project.isArchived ? 'archived' : 'unarchived'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error archiving project' });
  }
});

module.exports = router;