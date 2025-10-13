import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Redux actions
import { getProjects, toggleProjectFavorite } from '../../store/slices/projectSlice';

// Components
import Button, { IconButton } from '../../components/UI/Button';
import LoadingSpinner, { SkeletonLoader } from '../../components/UI/LoadingSpinner';

// Hooks
import { useDebounce } from '../../hooks/useDebounce';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    dispatch(getProjects({
      search: debouncedSearch,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      sortBy,
      page: 1,
      limit: 12,
    }));
  }, [dispatch, debouncedSearch, filterStatus, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleToggleFavorite = (projectId) => {
    dispatch(toggleProjectFavorite(projectId));
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="w-48" height="h-8" />
          <SkeletonLoader width="w-32" height="h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <SkeletonLoader height="h-6" />
              <SkeletonLoader height="h-4" width="w-3/4" />
              <SkeletonLoader height="h-4" width="w-1/2" />
            </div>
          ))}
        </div>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Projects
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Manage and track your project progress
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/projects/new"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            className="neon-glow"
          >
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
            <option value="priority">Priority</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-secondary-300 dark:border-secondary-600 rounded-lg overflow-hidden">
            <IconButton
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <ListBulletIcon className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        {projects.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Squares2X2Icon className="w-12 h-12 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first project'}
            </p>
            {!searchQuery && (
              <Button
                as={Link}
                to="/projects/new"
                leftIcon={<PlusIcon className="w-4 h-4" />}
              >
                Create Project
              </Button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className={`card p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(project.priority)} group`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <Link to={`/projects/${project._id}`}>
                          {project.name}
                        </Link>
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(project._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {project.isFavorite ? (
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <StarIcon className="w-4 h-4" />
                      )}
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-secondary-600 dark:text-secondary-400">Progress</span>
                      <span className="font-medium text-secondary-900 dark:text-white">
                        {project.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{project.members?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChartBarIcon className="w-4 h-4" />
                        <span>{project.tasksCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Team Avatars */}
                  {project.members && project.members.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, i) => (
                          <div
                            key={member._id}
                            className="w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-secondary-800"
                            style={{ zIndex: 3 - i }}
                          >
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="w-6 h-6 bg-secondary-300 dark:bg-secondary-600 rounded-full flex items-center justify-center text-secondary-600 dark:text-secondary-300 text-xs font-medium border-2 border-white dark:border-secondary-800">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className={`card p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityColor(project.priority)} group`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <Link to={`/projects/${project._id}`}>
                              {project.name}
                            </Link>
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-secondary-600 dark:text-secondary-400">
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="w-4 h-4" />
                          <span>{project.members?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ChartBarIcon className="w-4 h-4" />
                          <span>{project.tasksCount || 0}</span>
                        </div>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-purple-500 h-1.5 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(project._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {project.isFavorite ? (
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <StarIcon className="w-4 h-4" />
                      )}
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center space-x-2"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </motion.div>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && projects.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="lg" text="Loading projects..." />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;