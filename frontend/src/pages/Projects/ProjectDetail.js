import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import { getProject } from '../../store/slices/projectSlice';
import { getTasks } from '../../store/slices/taskSlice';
import Button, { IconButton } from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProject, isLoading } = useSelector((state) => state.projects);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data for demonstration
  const mockProject = {
    _id: id,
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX principles and responsive design.',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    progress: 65,
    createdAt: '2024-01-01',
    manager: { _id: '1', name: 'John Doe', avatar: null },
    members: [
      { _id: '1', name: 'John Doe', role: 'Project Manager', avatar: null },
      { _id: '2', name: 'Jane Smith', role: 'Frontend Developer', avatar: null },
      { _id: '3', name: 'Mike Johnson', role: 'UI/UX Designer', avatar: null },
    ],
    tasks: [
      { _id: '1', title: 'Design Homepage', status: 'completed', priority: 'high', assignedTo: 'Mike Johnson' },
      { _id: '2', title: 'Implement Navigation', status: 'in-progress', priority: 'medium', assignedTo: 'Jane Smith' },
      { _id: '3', title: 'User Testing', status: 'todo', priority: 'low', assignedTo: 'John Doe' },
    ],
    department: 'Engineering',
    tags: ['web', 'design', 'frontend'],
    budget: 50000,
    spent: 32500,
  };

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getTasks({ project: id }));
    }
  }, [dispatch, id]);

  const project = currentProject || mockProject;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'tasks', name: 'Tasks', icon: CheckCircleIcon },
    { id: 'team', name: 'Team', icon: UsersIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading project..." />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <IconButton
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="hover:bg-secondary-100 dark:hover:bg-secondary-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </IconButton>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
              {project.name}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority} priority
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" leftIcon={<PencilIcon className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="danger" leftIcon={<TrashIcon className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="card p-6" variants={itemVariants}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Project Progress
          </span>
          <span className="text-sm font-medium text-secondary-900 dark:text-white">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div className="border-b border-secondary-200 dark:border-secondary-700" variants={itemVariants}>
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Description
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {project.description}
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Task "Design Homepage" completed', user: 'Mike Johnson', time: '2 hours ago' },
                      { action: 'New task "Implement Navigation" created', user: 'John Doe', time: '1 day ago' },
                      { action: 'Jane Smith joined the project', user: 'System', time: '2 days ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-secondary-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-secondary-500">
                            by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">Start Date</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">End Date</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">Department</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {project.department}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">Budget</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        ${project.budget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">Spent</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        ${project.spent?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, index) => (
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
          )}

          {activeTab === 'tasks' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Project Tasks
                </h3>
                <Button
                  as={Link}
                  to="/tasks/new"
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Add Task
                </Button>
              </div>
              <div className="space-y-3">
                {project.tasks?.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-secondary-400'
                      }`} />
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Assigned to {task.assignedTo}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Team Members
                </h3>
                <Button leftIcon={<UserPlusIcon className="w-4 h-4" />}>
                  Add Member
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.members?.map((member) => (
                  <div key={member._id} className="flex items-center space-x-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-white">
                        {member.name}
                      </h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Tasks', value: '12', icon: CheckCircleIcon, color: 'text-blue-600' },
                { title: 'Completed', value: '8', icon: CheckCircleIcon, color: 'text-green-600' },
                { title: 'In Progress', value: '3', icon: ClockIcon, color: 'text-yellow-600' },
                { title: 'Overdue', value: '1', icon: ExclamationTriangleIcon, color: 'text-red-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;