import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PaperClipIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

import { getTask, updateTaskStatus } from '../../store/slices/taskSlice';
import Button, { IconButton } from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentTask, isLoading } = useSelector((state) => state.tasks);
  
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [timeTracking, setTimeTracking] = useState(false);

  // Mock task data for demonstration
  const mockTask = {
    _id: id,
    title: 'Design Homepage',
    description: 'Create a modern and responsive homepage design that follows the new brand guidelines. The design should be mobile-first and include all the necessary sections like hero, features, testimonials, and footer.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-25',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
    assignedTo: { _id: '1', name: 'John Doe', avatar: null },
    project: { _id: '1', name: 'Website Redesign' },
    tags: ['design', 'frontend', 'ui'],
    estimatedHours: 16,
    loggedHours: 8,
    progress: 50,
    comments: [
      {
        _id: '1',
        user: { name: 'Jane Smith', avatar: null },
        content: 'I\'ve reviewed the initial mockups and they look great! Just a few minor adjustments needed.',
        createdAt: '2024-01-18T10:30:00Z',
      },
      {
        _id: '2',
        user: { name: 'Mike Johnson', avatar: null },
        content: 'The color scheme works well with our brand. Can we make the CTA button more prominent?',
        createdAt: '2024-01-19T14:15:00Z',
      },
    ],
    attachments: [
      { _id: '1', name: 'homepage-mockup-v1.png', size: '2.4 MB', type: 'image' },
      { _id: '2', name: 'brand-guidelines.pdf', size: '1.8 MB', type: 'pdf' },
    ],
    subtasks: [
      { _id: '1', title: 'Create wireframes', completed: true },
      { _id: '2', title: 'Design hero section', completed: true },
      { _id: '3', title: 'Design features section', completed: false },
      { _id: '4', title: 'Design footer', completed: false },
    ],
  };

  useEffect(() => {
    if (id) {
      dispatch(getTask(id));
    }
  }, [dispatch, id]);

  const task = currentTask || mockTask;

  const handleStatusChange = (newStatus) => {
    dispatch(updateTaskStatus({ taskId: id, status: newStatus }));
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      // In a real app, this would dispatch an action to add the comment
      console.log('Adding comment:', comment);
      setComment('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on-hold': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200';
    }
  };

  const tabs = [
    { id: 'details', name: 'Details' },
    { id: 'comments', name: 'Comments', count: task.comments?.length },
    { id: 'attachments', name: 'Attachments', count: task.attachments?.length },
    { id: 'activity', name: 'Activity' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading task..." />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconButton
            variant="ghost"
            onClick={() => navigate('/tasks')}
            className="hover:bg-secondary-100 dark:hover:bg-secondary-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </IconButton>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
              {task.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={timeTracking ? "danger" : "success"}
            leftIcon={timeTracking ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            onClick={() => setTimeTracking(!timeTracking)}
          >
            {timeTracking ? 'Stop' : 'Start'} Timer
          </Button>
          <Button variant="outline" leftIcon={<PencilIcon className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="danger" leftIcon={<TrashIcon className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Progress
              </span>
              <span className="text-sm font-medium text-secondary-900 dark:text-white">
                {task.progress}%
              </span>
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="border-b border-secondary-200 dark:border-secondary-700">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
                    }`}
                  >
                    <span>{tab.name}</span>
                    {tab.count && (
                      <span className="bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                          Description
                        </h3>
                        <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                          Subtasks
                        </h3>
                        <div className="space-y-2">
                          {task.subtasks?.map((subtask) => (
                            <div key={subtask._id} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => {}}
                                className="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                              />
                              <span className={`text-sm ${subtask.completed ? 'line-through text-secondary-500' : 'text-secondary-900 dark:text-white'}`}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'comments' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {task.comments?.map((comment) => (
                          <div key={comment._id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {comment.user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                                    {comment.user.name}
                                  </span>
                                  <span className="text-xs text-secondary-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {user?.name?.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              rows={3}
                            />
                            <div className="flex justify-end mt-2">
                              <Button onClick={handleAddComment} disabled={!comment.trim()}>
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'attachments' && (
                    <div className="space-y-4">
                      {task.attachments?.map((attachment) => (
                        <div key={attachment._id} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PaperClipIcon className="w-5 h-5 text-secondary-400" />
                            <div>
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-secondary-500">
                                {attachment.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-4">
                      {[
                        { action: 'Task created', user: 'John Doe', time: '2024-01-10T09:00:00Z' },
                        { action: 'Status changed to In Progress', user: 'John Doe', time: '2024-01-15T14:30:00Z' },
                        { action: 'Comment added', user: 'Jane Smith', time: '2024-01-18T10:30:00Z' },
                        { action: 'Attachment uploaded', user: 'Mike Johnson', time: '2024-01-19T16:45:00Z' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm text-secondary-900 dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-xs text-secondary-500">
                              by {activity.user} • {new Date(activity.time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Task Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Assignee
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {task.assignedTo?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-secondary-900 dark:text-white">
                    {task.assignedTo?.name}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Due Date
                </label>
                <p className="mt-1 text-sm text-secondary-900 dark:text-white">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Project
                </label>
                <Link
                  to={`/projects/${task.project?._id}`}
                  className="mt-1 block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {task.project?.name}
                </Link>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Time Tracking
                </label>
                <div className="mt-1 text-sm text-secondary-900 dark:text-white">
                  {task.loggedHours}h / {task.estimatedHours}h
                </div>
                <div className="mt-1 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1">
                  <div
                    className="bg-primary-500 h-1 rounded-full"
                    style={{ width: `${(task.loggedHours / task.estimatedHours) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetail;