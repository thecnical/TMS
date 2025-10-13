import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  ClockIcon,
  FlagIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';

// Redux actions
import { getTasks, updateTask, reorderTasks } from '../../store/slices/taskSlice';

// Components
import Button, { IconButton } from '../../components/UI/Button';
import LoadingSpinner, { SkeletonLoader } from '../../components/UI/LoadingSpinner';

// Hooks
import { useDebounce } from '../../hooks/useDebounce';
import { useSocket } from '../../hooks/useSocket';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { emitTaskUpdate } = useSocket();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'grid'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterAssignee] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const taskStatuses = [
    { id: 'todo', name: 'To Do', color: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'review', name: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'completed', name: 'Completed', color: 'bg-green-100 dark:bg-green-900' },
  ];

  useEffect(() => {
    dispatch(getTasks({
      search: debouncedSearch,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      project: filterProject !== 'all' ? filterProject : undefined,
      assignedTo: filterAssignee !== 'all' ? filterAssignee : undefined,
      sortBy,
      page: 1,
      limit: 50,
    }));
  }, [dispatch, debouncedSearch, filterStatus, filterProject, filterAssignee, sortBy]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Moving between columns (status change)
      const newStatus = destination.droppableId;
      dispatch(updateTask({
        id: draggableId,
        taskData: { status: newStatus }
      }));
      emitTaskUpdate({ id: draggableId, status: newStatus });
    } else if (source.index !== destination.index) {
      // Reordering within the same column
      const columnTasks = getTasksByStatus(source.droppableId);
      const reorderedTasks = Array.from(columnTasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);
      
      dispatch(reorderTasks({
        status: source.droppableId,
        tasks: reorderedTasks.map((task, index) => ({ id: task._id, order: index }))
      }));
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-300 bg-white dark:bg-secondary-800';
    }
  };

  const getPriorityIcon = (priority) => {
    const baseClasses = "w-4 h-4";
    switch (priority) {
      case 'urgent':
        return <FlagIcon className={`${baseClasses} text-red-500`} />;
      case 'high':
        return <FlagIcon className={`${baseClasses} text-orange-500`} />;
      case 'medium':
        return <FlagIcon className={`${baseClasses} text-yellow-500`} />;
      case 'low':
        return <FlagIcon className={`${baseClasses} text-green-500`} />;
      default:
        return <FlagIcon className={`${baseClasses} text-gray-400`} />;
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

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

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="w-48" height="h-8" />
          <SkeletonLoader width="w-32" height="h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <SkeletonLoader height="h-6" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="card p-4 space-y-3">
                  <SkeletonLoader height="h-4" />
                  <SkeletonLoader height="h-3" width="w-3/4" />
                  <SkeletonLoader height="h-3" width="w-1/2" />
                </div>
              ))}
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
            Tasks
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Organize and track your work efficiently
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/tasks/new"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            className="neon-glow"
          >
            New Task
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
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
              placeholder="Search tasks..."
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>

          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-secondary-300 dark:border-secondary-600 rounded-lg overflow-hidden">
            <IconButton
              variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="rounded-none"
            >
              <ViewColumnsIcon className="w-4 h-4" />
            </IconButton>
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

      {/* Tasks Display */}
      <AnimatePresence mode="wait">
        {tasks.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListBulletIcon className="w-12 h-12 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first task'}
            </p>
            {!searchQuery && (
              <Button
                as={Link}
                to="/tasks/new"
                leftIcon={<PlusIcon className="w-4 h-4" />}
              >
                Create Task
              </Button>
            )}
          </motion.div>
        ) : viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {taskStatuses.map((status) => (
                <motion.div
                  key={status.id}
                  className="space-y-4"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {status.name}
                    </h3>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                      {getTasksByStatus(status.id).length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={status.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-600' 
                            : status.color
                        }`}
                      >
                        <AnimatePresence>
                          {getTasksByStatus(status.id).map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`card p-4 mb-3 border-l-4 cursor-pointer group ${getPriorityColor(task.priority)} ${
                                    snapshot.isDragging ? 'shadow-2xl rotate-3 neon-glow' : 'hover:shadow-lg'
                                  }`}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  layout
                                  whileHover={{ scale: 1.02 }}
                                  whileDrag={{ scale: 1.05, rotate: 5 }}
                                >
                                  <div className="space-y-3">
                                    {/* Task Header */}
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                        <Link to={`/tasks/${task._id}`}>
                                          {task.title}
                                        </Link>
                                      </h4>
                                      <div className="flex items-center space-x-1">
                                        {getPriorityIcon(task.priority)}
                                        <IconButton
                                          variant="ghost"
                                          size="sm"
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <EllipsisVerticalIcon className="w-4 h-4" />
                                        </IconButton>
                                      </div>
                                    </div>

                                    {/* Task Description */}
                                    {task.description && (
                                      <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Task Meta */}
                                    <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
                                      <div className="flex items-center space-x-2">
                                        {task.project && (
                                          <span className="bg-secondary-200 dark:bg-secondary-700 px-2 py-1 rounded">
                                            {task.project.name}
                                          </span>
                                        )}
                                        {task.dueDate && (
                                          <div className={`flex items-center space-x-1 ${
                                            isOverdue(task.dueDate) ? 'text-red-500' : ''
                                          }`}>
                                            <CalendarDaysIcon className="w-3 h-3" />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Task Footer */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        {task.assignedTo && (
                                          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                            {task.assignedTo.name?.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 text-xs text-secondary-400">
                                        {task.commentsCount > 0 && (
                                          <div className="flex items-center space-x-1">
                                            <ChatBubbleLeftIcon className="w-3 h-3" />
                                            <span>{task.commentsCount}</span>
                                          </div>
                                        )}
                                        {task.attachmentsCount > 0 && (
                                          <div className="flex items-center space-x-1">
                                            <PaperClipIcon className="w-3 h-3" />
                                            <span>{task.attachmentsCount}</span>
                                          </div>
                                        )}
                                        {task.timeTracked && (
                                          <div className="flex items-center space-x-1">
                                            <ClockIcon className="w-3 h-3" />
                                            <span>{task.timeTracked}h</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              ))}
            </motion.div>
          </DragDropContext>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Other view modes would go here */}
            <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400">
                {viewMode === 'grid' ? 'Grid view' : 'List view'} coming soon!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && tasks.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="lg" text="Loading tasks..." />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tasks;