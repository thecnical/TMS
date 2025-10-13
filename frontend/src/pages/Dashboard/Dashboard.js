import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Icons
import {
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Components
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Button from '../../components/UI/Button';

// Redux actions
import { getTasks } from '../../store/slices/taskSlice';
import { getProjects } from '../../store/slices/projectSlice';
import { getDashboardAnalytics } from '../../store/slices/analyticsSlice';

// Hooks
import { useSocket } from '../../hooks/useSocket';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading: tasksLoading } = useSelector((state) => state.tasks);
  const { isLoading: projectsLoading } = useSelector((state) => state.projects);
  const { dashboardData, isLoading: analyticsLoading } = useSelector((state) => state.analytics);
  const { isConnected, onlineUsers } = useSocket();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Fetch dashboard data only if user is available
    if (user?._id) {
      dispatch(getTasks({ limit: 5, assignedTo: user._id }));
      dispatch(getProjects({ limit: 5 }));
      dispatch(getDashboardAnalytics());
    }
  }, [dispatch, user]);

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

  const statsCards = [
    {
      title: 'Total Tasks',
      value: dashboardData?.summary?.totalTasks || 0,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Completed Today',
      value: dashboardData?.summary?.completedThisPeriod || 0,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Active Projects',
      value: dashboardData?.summary?.totalProjects || 0,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+3%',
      changeType: 'positive',
    },
    {
      title: 'Team Members',
      value: dashboardData?.summary?.totalUsers || 0,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+2%',
      changeType: 'positive',
    },
  ];

  if (tasksLoading || projectsLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
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
            {greeting}, {user?.name}! 👋
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
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

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="card p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                    {stat.value}
                  </p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div
          className="lg:col-span-2 card p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              Recent Tasks
            </h2>
            <Button
              as={Link}
              to="/tasks"
              variant="ghost"
              size="sm"
              rightIcon={<ArrowTrendingUpIcon className="w-4 h-4" />}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task, index) => (
              <motion.div
                key={task._id}
                className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {task.project?.name} • Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {task.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions & Stats */}
        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button
                as={Link}
                to="/projects/new"
                fullWidth
                variant="outline"
                leftIcon={<PlusIcon className="w-4 h-4" />}
              >
                Create Project
              </Button>
              <Button
                as={Link}
                to="/team/invite"
                fullWidth
                variant="outline"
                leftIcon={<UserGroupIcon className="w-4 h-4" />}
              >
                Invite Team Member
              </Button>
              <Button
                as={Link}
                to="/analytics"
                fullWidth
                variant="outline"
                leftIcon={<ChartBarIcon className="w-4 h-4" />}
              >
                View Analytics
              </Button>
            </div>
          </div>

          {/* Online Team Members */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              Online Team ({onlineUsers.length})
            </h2>
            <div className="space-y-3">
              {onlineUsers.slice(0, 5).map((userId) => (
                <div key={userId} className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      User {userId.slice(-4)}
                    </p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      <span className="text-xs text-secondary-600 dark:text-secondary-400">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mr-2" />
              Upcoming Deadlines
            </h2>
            <div className="space-y-3">
              {tasks
                .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
                .slice(0, 3)
                .map((task) => (
                  <div key={task._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">
                        {task.project?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;