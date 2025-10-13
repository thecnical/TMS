import { apiRequest } from './api';

// Mock data for development
const mockProjects = [
  {
    _id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    progress: 65,
    createdAt: '2024-01-01',
    manager: { _id: '1', name: 'John Doe' },
    members: [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Smith' },
    ],
    tasksCount: 12,
    department: 'Engineering',
    tags: ['web', 'design', 'frontend'],
  },
  {
    _id: '2',
    name: 'Mobile App',
    description: 'Development of a new mobile application for iOS and Android',
    status: 'active',
    priority: 'urgent',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    progress: 30,
    createdAt: '2024-01-15',
    manager: { _id: '2', name: 'Jane Smith' },
    members: [
      { _id: '2', name: 'Jane Smith' },
      { _id: '3', name: 'Mike Johnson' },
    ],
    tasksCount: 8,
    department: 'Engineering',
    tags: ['mobile', 'react-native', 'app'],
  },
  {
    _id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 marketing campaign for product launch',
    status: 'on-hold',
    priority: 'medium',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    progress: 15,
    createdAt: '2024-01-20',
    manager: { _id: '3', name: 'Mike Johnson' },
    members: [
      { _id: '3', name: 'Mike Johnson' },
    ],
    tasksCount: 5,
    department: 'Marketing',
    tags: ['marketing', 'campaign', 'social-media'],
  },
];

const MOCK_MODE = true; // Set to false when backend is available

const projectService = {
  // Get all projects
  getProjects: async (params = {}) => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        projects: mockProjects,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: mockProjects.length,
        }
      };
    }
    
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/projects?${queryString}` : '/projects';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get project by ID
  getProject: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const project = mockProjects.find(p => p._id === id);
      if (!project) throw new Error('Project not found');
      return { project };
    }
    
    const response = await apiRequest.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  createProject: async (projectData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newProject = {
        _id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        progress: 0,
        manager: { _id: projectData.createdBy, name: 'Current User' },
        members: [{ _id: projectData.createdBy, name: 'Current User' }],
        tasksCount: 0,
      };
      mockProjects.push(newProject);
      return { project: newProject };
    }
    
    const response = await apiRequest.post('/projects', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await apiRequest.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await apiRequest.delete(`/projects/${id}`);
    return response.data;
  },

  // Add member to project
  addMember: async (projectId, memberData) => {
    const response = await apiRequest.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    const response = await apiRequest.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  // Update member role
  updateMemberRole: async (projectId, userId, role) => {
    const response = await apiRequest.put(`/projects/${projectId}/members/${userId}`, { role });
    return response.data;
  },

  // Archive/Unarchive project
  toggleArchive: async (id) => {
    const response = await apiRequest.put(`/projects/${id}/archive`);
    return response.data;
  },

  // Toggle project favorite
  toggleFavorite: async (id) => {
    const response = await apiRequest.put(`/projects/${id}/favorite`);
    return response.data;
  },

  // Get project statistics
  getProjectStats: async (id) => {
    const response = await apiRequest.get(`/projects/${id}/stats`);
    return response.data;
  },

  // Get project activity
  getProjectActivity: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/projects/${id}/activity?${queryString}` : `/projects/${id}/activity`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Duplicate project
  duplicateProject: async (id, newName) => {
    const response = await apiRequest.post(`/projects/${id}/duplicate`, { name: newName });
    return response.data;
  },

  // Export project
  exportProject: async (id, format = 'json') => {
    const response = await apiRequest.get(`/projects/${id}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Import project
  importProject: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiRequest.post('/projects/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get project templates
  getProjectTemplates: async () => {
    const response = await apiRequest.get('/projects/templates');
    return response.data;
  },

  // Create project from template
  createFromTemplate: async (templateId, projectData) => {
    const response = await apiRequest.post(`/projects/templates/${templateId}`, projectData);
    return response.data;
  },

  // Get project permissions
  getProjectPermissions: async (id) => {
    const response = await apiRequest.get(`/projects/${id}/permissions`);
    return response.data;
  },

  // Update project permissions
  updateProjectPermissions: async (id, permissions) => {
    const response = await apiRequest.put(`/projects/${id}/permissions`, permissions);
    return response.data;
  },

  // Get project timeline
  getProjectTimeline: async (id) => {
    const response = await apiRequest.get(`/projects/${id}/timeline`);
    return response.data;
  },

  // Get project calendar
  getProjectCalendar: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/projects/${id}/calendar?${queryString}` : `/projects/${id}/calendar`;
    const response = await apiRequest.get(url);
    return response.data;
  },
};

export default projectService;