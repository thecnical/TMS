import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Redux actions
import { getDashboardAnalytics, getTeamAnalytics } from '../../store/slices/analyticsSlice';

// Components
import Button, { IconButton } from '../../components/UI/Button';
import { SkeletonLoader } from '../../components/UI/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading } = useSelector((state) => state.analytics);

  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    dispatch(getDashboardAnalytics(timeRange));
    dispatch(getTeamAnalytics(timeRange));
  }, [dispatch, timeRange]);

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Mock data for demonstration
  const mockData = {
    summary: {
      totalTasks: 156,
      completedTasks: 89,
      activeTasks: 45,
      overdueTasks: 12,
      totalProjects: 8,
      activeProjects: 5,
      totalUsers: 12,
      activeUsers: 9,
    },
    trends: {
      tasksCompleted: [12, 19, 15, 25, 22, 18, 28, 24, 20, 26, 30, 35],
      tasksCreated: [8, 15, 12, 20, 18, 14, 22, 20, 16, 24, 28, 32],
      productivity: [75, 78, 82, 79, 85, 88, 92, 89, 91, 94, 96, 98],
    },
    projectStatus: {
      labels: ['Active', 'On Hold', 'Completed', 'Archived'],
      data: [5, 1, 2, 0],
      colors: ['#3B82F6', '#F59E0B', '#10B981', '#6B7280'],
    },
    teamPerformance: {
      labels: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
      tasksCompleted: [23, 19, 15, 28, 21],
      hoursWorked: [42, 38, 35, 45, 40],
    },
  };

  const data = dashboardData || mockData;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
        },
      },
    },
  };

  const tasksChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: data.trends?.tasksCompleted || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Tasks Created',
        data: data.trends?.tasksCreated || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const productivityChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Productivity %',
        data: data.trends?.productivity || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const projectStatusData = {
    labels: data.projectStatus?.labels || [],
    datasets: [
      {
        data: data.projectStatus?.data || [],
        backgroundColor: data.projectStatus?.colors || [],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const teamPerformanceData = {
    labels: data.teamPerformance?.labels || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: data.teamPerformance?.tasksCompleted || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Hours Worked',
        data: data.teamPerformance?.hoursWorked || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const statsCards = [
    {
      title: 'Total Tasks',
      value: data.summary?.totalTasks || 0,
      change: '+12%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Completed Tasks',
      value: data.summary?.completedTasks || 0,
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      title: 'Active Projects',
      value: data.summary?.activeProjects || 0,
      change: '+3%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      title: 'Overdue Tasks',
      value: data.summary?.overdueTasks || 0,
      change: '-5%',
      changeType: 'negative',
      icon: ExclamationTriangleIcon,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="w-48" height="h-8" />
          <SkeletonLoader width="w-32" height="h-10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <SkeletonLoader height="h-6" />
              <SkeletonLoader height="h-8" width="w-1/2" />
              <SkeletonLoader height="h-4" width="w-1/3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <SkeletonLoader height="h-6" className="mb-4" />
              <SkeletonLoader height="h-64" />
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
            Analytics
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Insights and performance metrics for your projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <IconButton
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(getDashboardAnalytics(timeRange));
              dispatch(getTeamAnalytics(timeRange));
            }}
          >
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
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
                  <div className={`ml-2 flex items-center text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Trend Chart */}
        <motion.div
          className="card p-6"
          variants={chartVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Tasks Overview
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Completed</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Created</span>
            </div>
          </div>
          <div className="h-64">
            <Line data={tasksChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Productivity Chart */}
        <motion.div
          className="card p-6"
          variants={chartVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Team Productivity
            </h3>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Average: 89%
            </span>
          </div>
          <div className="h-64">
            <Bar data={productivityChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Project Status Chart */}
        <motion.div
          className="card p-6"
          variants={chartVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Project Status
            </h3>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {data.summary?.totalProjects || 0} total
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut 
                data={projectStatusData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
                      },
                    },
                  },
                }} 
              />
            </div>
          </div>
        </motion.div>

        {/* Team Performance Chart */}
        <motion.div
          className="card p-6"
          variants={chartVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Team Performance
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Tasks</span>
              <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Hours</span>
            </div>
          </div>
          <div className="h-64">
            <Bar data={teamPerformanceData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics Table */}
      <motion.div
        className="card p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Detailed Metrics
          </h3>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {[
                { metric: 'Tasks Completed', current: 89, previous: 76, change: '+17%' },
                { metric: 'Average Completion Time', current: '2.3 days', previous: '2.8 days', change: '-18%' },
                { metric: 'Team Productivity', current: '94%', previous: '87%', change: '+8%' },
                { metric: 'Project Delivery Rate', current: '92%', previous: '88%', change: '+5%' },
              ].map((row, index) => (
                <motion.tr
                  key={row.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                    {row.metric}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                    {row.current}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                    {row.previous}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.change.startsWith('+') 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {row.change}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;