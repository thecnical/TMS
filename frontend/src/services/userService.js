import { apiRequest } from './api';

const MOCK_MODE = true; // Set to false when backend is available

// Mock users data
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'Project Manager',
    department: 'Engineering',
    role: 'admin',
    status: 'active',
    avatar: null,
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinedAt: '2024-01-01T00:00:00.000Z',
    lastActive: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    title: 'Senior Developer',
    department: 'Engineering',
    role: 'member',
    status: 'active',
    avatar: null,
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    joinedAt: '2024-01-15T00:00:00.000Z',
    lastActive: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    title: 'UX Designer',
    department: 'Design',
    role: 'member',
    status: 'active',
    avatar: null,
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    joinedAt: '2024-02-01T00:00:00.000Z',
    lastActive: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
];

const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        users: mockUsers,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: mockUsers.length,
        }
      };
    }
    
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await apiRequest.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiRequest.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiRequest.delete(`/users/${id}`);
    return response.data;
  },

  // Get user dashboard
  getUserDashboard: async (id) => {
    const response = await apiRequest.get(`/users/${id}/dashboard`);
    return response.data;
  },

  // Search users
  searchUsers: async (query, limit = 10) => {
    const response = await apiRequest.get(`/users/search/${encodeURIComponent(query)}?limit=${limit}`);
    return response.data;
  },

  // Get user profile
  getUserProfile: async (id) => {
    const response = await apiRequest.get(`/users/${id}/profile`);
    return response.data;
  },

  // Update user avatar
  updateUserAvatar: async (id, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }
    
    const response = await apiRequest.post(`/users/${id}/avatar`, formData, config);
    return response.data;
  },

  // Delete user avatar
  deleteUserAvatar: async (id) => {
    const response = await apiRequest.delete(`/users/${id}/avatar`);
    return response.data;
  },

  // Get user activity
  getUserActivity: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users/${id}/activity?${queryString}` : `/users/${id}/activity`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get user notifications
  getUserNotifications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users/notifications?${queryString}` : '/users/notifications';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await apiRequest.put(`/users/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await apiRequest.put('/users/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await apiRequest.delete(`/users/notifications/${notificationId}`);
    return response.data;
  },

  // Get user preferences
  getUserPreferences: async () => {
    const response = await apiRequest.get('/users/preferences');
    return response.data;
  },

  // Update user preferences
  updateUserPreferences: async (preferences) => {
    const response = await apiRequest.put('/users/preferences', preferences);
    return response.data;
  },

  // Get user statistics
  getUserStats: async (id) => {
    const response = await apiRequest.get(`/users/${id}/stats`);
    return response.data;
  },

  // Get user workload
  getUserWorkload: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users/${id}/workload?${queryString}` : `/users/${id}/workload`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get user calendar
  getUserCalendar: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users/${id}/calendar?${queryString}` : `/users/${id}/calendar`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Invite user
  inviteUser: async (inviteData) => {
    const response = await apiRequest.post('/users/invite', inviteData);
    return response.data;
  },

  // Resend invitation
  resendInvitation: async (inviteId) => {
    const response = await apiRequest.post(`/users/invite/${inviteId}/resend`);
    return response.data;
  },

  // Cancel invitation
  cancelInvitation: async (inviteId) => {
    const response = await apiRequest.delete(`/users/invite/${inviteId}`);
    return response.data;
  },

  // Get pending invitations
  getPendingInvitations: async () => {
    const response = await apiRequest.get('/users/invitations/pending');
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (token, userData) => {
    const response = await apiRequest.post('/users/invitations/accept', {
      token,
      ...userData,
    });
    return response.data;
  },

  // Decline invitation
  declineInvitation: async (token) => {
    const response = await apiRequest.post('/users/invitations/decline', { token });
    return response.data;
  },

  // Deactivate user
  deactivateUser: async (id) => {
    const response = await apiRequest.put(`/users/${id}/deactivate`);
    return response.data;
  },

  // Activate user
  activateUser: async (id) => {
    const response = await apiRequest.put(`/users/${id}/activate`);
    return response.data;
  },

  // Export users
  exportUsers: async (params = {}, format = 'csv') => {
    const queryString = new URLSearchParams({ ...params, format }).toString();
    const response = await apiRequest.get(`/users/export?${queryString}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Import users
  importUsers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiRequest.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default userService;