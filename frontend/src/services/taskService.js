import { apiRequest } from './api';

// Mock data for development
const mockTasks = [
  {
    _id: '1',
    title: 'Design Homepage',
    description: 'Create a modern and responsive homepage design',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-20',
    createdAt: '2024-01-10',
    assignedTo: { _id: '1', name: 'John Doe' },
    project: { _id: '1', name: 'Website Redesign' },
    tags: ['design', 'frontend'],
  },
  {
    _id: '2',
    title: 'API Integration',
    description: 'Integrate the new API endpoints with the frontend',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2024-01-25',
    createdAt: '2024-01-12',
    assignedTo: { _id: '2', name: 'Jane Smith' },
    project: { _id: '2', name: 'Mobile App' },
    tags: ['backend', 'api'],
  },
  {
    _id: '3',
    title: 'User Testing',
    description: 'Conduct user testing sessions for the new features',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-30',
    createdAt: '2024-01-15',
    assignedTo: { _id: '3', name: 'Mike Johnson' },
    project: { _id: '1', name: 'Website Redesign' },
    tags: ['testing', 'ux'],
  },
];

const MOCK_MODE = true; // Set to false when backend is available

const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        tasks: mockTasks,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: mockTasks.length,
        }
      };
    }
    
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get task by ID
  getTask: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const task = mockTasks.find(t => t._id === id);
      if (!task) throw new Error('Task not found');
      return { task };
    }
    
    const response = await apiRequest.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newTask = {
        _id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        assignedTo: { _id: taskData.assignedTo, name: 'Current User' },
        project: taskData.projectId ? { _id: taskData.projectId, name: 'Selected Project' } : null,
      };
      mockTasks.push(newTask);
      return { task: newTask };
    }
    
    const response = await apiRequest.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await apiRequest.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await apiRequest.delete(`/tasks/${id}`);
    return response.data;
  },

  // Add comment to task
  addComment: async (taskId, commentData) => {
    const response = await apiRequest.post(`/tasks/${taskId}/comments`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (taskId, commentId, commentData) => {
    const response = await apiRequest.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (taskId, commentId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },

  // Add time tracking entry
  addTimeEntry: async (taskId, timeData) => {
    const response = await apiRequest.post(`/tasks/${taskId}/time`, timeData);
    return response.data;
  },

  // Update time entry
  updateTimeEntry: async (taskId, entryId, timeData) => {
    const response = await apiRequest.put(`/tasks/${taskId}/time/${entryId}`, timeData);
    return response.data;
  },

  // Delete time entry
  deleteTimeEntry: async (taskId, entryId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/time/${entryId}`);
    return response.data;
  },

  // Get tasks by project
  getTasksByProject: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/tasks/project/${projectId}?${queryString}` : `/tasks/project/${projectId}`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Reorder tasks
  reorderTasks: async (tasks) => {
    const response = await apiRequest.put('/tasks/reorder', { tasks });
    return response.data;
  },

  // Bulk update tasks
  bulkUpdateTasks: async (taskIds, updateData) => {
    const response = await apiRequest.put('/tasks/bulk-update', {
      taskIds,
      updateData,
    });
    return response.data;
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds) => {
    const response = await apiRequest.delete('/tasks/bulk-delete', {
      data: { taskIds },
    });
    return response.data;
  },

  // Add subtask
  addSubtask: async (taskId, subtaskData) => {
    const response = await apiRequest.post(`/tasks/${taskId}/subtasks`, subtaskData);
    return response.data;
  },

  // Update subtask
  updateSubtask: async (taskId, subtaskId, subtaskData) => {
    const response = await apiRequest.put(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
    return response.data;
  },

  // Delete subtask
  deleteSubtask: async (taskId, subtaskId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  },

  // Add attachment
  addAttachment: async (taskId, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
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
    
    const response = await apiRequest.post(`/tasks/${taskId}/attachments`, formData, config);
    return response.data;
  },

  // Delete attachment
  deleteAttachment: async (taskId, attachmentId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response.data;
  },

  // Add watcher
  addWatcher: async (taskId, userId) => {
    const response = await apiRequest.post(`/tasks/${taskId}/watchers`, { userId });
    return response.data;
  },

  // Remove watcher
  removeWatcher: async (taskId, userId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/watchers/${userId}`);
    return response.data;
  },

  // Add dependency
  addDependency: async (taskId, dependencyData) => {
    const response = await apiRequest.post(`/tasks/${taskId}/dependencies`, dependencyData);
    return response.data;
  },

  // Remove dependency
  removeDependency: async (taskId, dependencyId) => {
    const response = await apiRequest.delete(`/tasks/${taskId}/dependencies/${dependencyId}`);
    return response.data;
  },

  // Get task history
  getTaskHistory: async (taskId) => {
    const response = await apiRequest.get(`/tasks/${taskId}/history`);
    return response.data;
  },

  // Duplicate task
  duplicateTask: async (taskId, projectId = null) => {
    const response = await apiRequest.post(`/tasks/${taskId}/duplicate`, { projectId });
    return response.data;
  },

  // Move task to project
  moveTask: async (taskId, projectId) => {
    const response = await apiRequest.put(`/tasks/${taskId}/move`, { projectId });
    return response.data;
  },

  // Archive task
  archiveTask: async (taskId) => {
    const response = await apiRequest.put(`/tasks/${taskId}/archive`);
    return response.data;
  },

  // Restore task
  restoreTask: async (taskId) => {
    const response = await apiRequest.put(`/tasks/${taskId}/restore`);
    return response.data;
  },

  // Get task templates
  getTaskTemplates: async () => {
    const response = await apiRequest.get('/tasks/templates');
    return response.data;
  },

  // Create task from template
  createFromTemplate: async (templateId, taskData) => {
    const response = await apiRequest.post(`/tasks/templates/${templateId}`, taskData);
    return response.data;
  },

  // Export tasks
  exportTasks: async (params = {}, format = 'csv') => {
    const queryString = new URLSearchParams({ ...params, format }).toString();
    const response = await apiRequest.get(`/tasks/export?${queryString}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Import tasks
  importTasks: async (file, projectId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    
    const response = await apiRequest.post('/tasks/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default taskService;