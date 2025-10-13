import { apiRequest } from './api';

const MOCK_MODE = true; // Set to false when backend is available

// Mock analytics data
const mockDashboardData = {
  totalTasks: 156,
  completedTasks: 89,
  inProgressTasks: 45,
  overdueTasks: 12,
  totalProjects: 8,
  activeProjects: 6,
  completedProjects: 2,
  teamMembers: 12,
  productivity: 78,
  efficiency: 85,
  taskCompletionRate: 57,
  projectProgress: 68,
  chartData: {
    taskCompletion: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Completed Tasks',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }]
    },
    projectStatus: {
      labels: ['Active', 'Completed', 'On Hold', 'Cancelled'],
      datasets: [{
        data: [6, 2, 1, 0],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      }]
    }
  }
};

const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async (timeRange = '30') => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { analytics: mockDashboardData };
    }
    
    const response = await apiRequest.get(`/analytics/dashboard?timeRange=${timeRange}`);
    return response.data;
  },

  // Get project analytics
  getProjectAnalytics: async (projectId) => {
    const response = await apiRequest.get(`/analytics/project/${projectId}`);
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (userId) => {
    const response = await apiRequest.get(`/analytics/user/${userId}`);
    return response.data;
  },

  // Get team analytics
  getTeamAnalytics: async (timeRange = '30') => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        teamAnalytics: {
          totalMembers: 12,
          activeMembers: 10,
          averageTasksPerMember: 13,
          topPerformers: [
            { name: 'John Doe', tasksCompleted: 25, efficiency: 92 },
            { name: 'Jane Smith', tasksCompleted: 23, efficiency: 88 },
            { name: 'Mike Johnson', tasksCompleted: 20, efficiency: 85 },
          ]
        }
      };
    }
    
    const response = await apiRequest.get(`/analytics/team?timeRange=${timeRange}`);
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/performance?${queryString}` : '/analytics/performance';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get productivity trends
  getProductivityTrends: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/productivity?${queryString}` : '/analytics/productivity';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get workload distribution
  getWorkloadDistribution: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/workload?${queryString}` : '/analytics/workload';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get time tracking analytics
  getTimeTrackingAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/time-tracking?${queryString}` : '/analytics/time-tracking';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get burndown chart data
  getBurndownChart: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/analytics/burndown/${projectId}?${queryString}` 
      : `/analytics/burndown/${projectId}`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get velocity chart data
  getVelocityChart: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/analytics/velocity/${projectId}?${queryString}` 
      : `/analytics/velocity/${projectId}`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get cumulative flow diagram
  getCumulativeFlow: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/analytics/cumulative-flow/${projectId}?${queryString}` 
      : `/analytics/cumulative-flow/${projectId}`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get lead time analytics
  getLeadTimeAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/lead-time?${queryString}` : '/analytics/lead-time';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get cycle time analytics
  getCycleTimeAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/cycle-time?${queryString}` : '/analytics/cycle-time';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get task completion trends
  getTaskCompletionTrends: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/task-completion?${queryString}` : '/analytics/task-completion';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get project health score
  getProjectHealthScore: async (projectId) => {
    const response = await apiRequest.get(`/analytics/project-health/${projectId}`);
    return response.data;
  },

  // Get team collaboration metrics
  getCollaborationMetrics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/collaboration?${queryString}` : '/analytics/collaboration';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get resource utilization
  getResourceUtilization: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/analytics/resource-utilization?${queryString}` : '/analytics/resource-utilization';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get custom reports
  getCustomReport: async (reportId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/analytics/reports/${reportId}?${queryString}` 
      : `/analytics/reports/${reportId}`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Create custom report
  createCustomReport: async (reportData) => {
    const response = await apiRequest.post('/analytics/reports', reportData);
    return response.data;
  },

  // Update custom report
  updateCustomReport: async (reportId, reportData) => {
    const response = await apiRequest.put(`/analytics/reports/${reportId}`, reportData);
    return response.data;
  },

  // Delete custom report
  deleteCustomReport: async (reportId) => {
    const response = await apiRequest.delete(`/analytics/reports/${reportId}`);
    return response.data;
  },

  // Get saved reports
  getSavedReports: async () => {
    const response = await apiRequest.get('/analytics/reports');
    return response.data;
  },

  // Export analytics data
  exportAnalytics: async (type, params = {}, format = 'csv') => {
    const queryString = new URLSearchParams({ ...params, format }).toString();
    const response = await apiRequest.get(`/analytics/export/${type}?${queryString}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Get real-time metrics
  getRealTimeMetrics: async () => {
    const response = await apiRequest.get('/analytics/real-time');
    return response.data;
  },

  // Get forecast data
  getForecastData: async (type, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/analytics/forecast/${type}?${queryString}` 
      : `/analytics/forecast/${type}`;
    const response = await apiRequest.get(url);
    return response.data;
  },
};

export default analyticsService;