import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
  filters: {
    search: '',
    status: '',
    priority: '',
  },
};

// Get all projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (params = {}, thunkAPI) => {
    try {
      return await projectService.getProjects(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch projects';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project by ID
export const getProject = createAsyncThunk(
  'projects/getById',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProject(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      return await projectService.createProject(projectData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, projectData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add member to project
export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, memberData }, thunkAPI) => {
    try {
      return await projectService.addMember(projectId, memberData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add member';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove member from project
export const removeMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }, thunkAPI) => {
    try {
      return await projectService.removeMember(projectId, userId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to remove member';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Archive/Unarchive project
export const toggleArchiveProject = createAsyncThunk(
  'projects/toggleArchive',
  async (id, thunkAPI) => {
    try {
      return await projectService.toggleArchive(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to archive project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle project favorite
export const toggleProjectFavorite = createAsyncThunk(
  'projects/toggleFavorite',
  async (id, thunkAPI) => {
    try {
      return await projectService.toggleFavorite(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to toggle favorite';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        priority: '',
      };
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateProjectInList: (state, action) => {
      const updatedProject = action.payload;
      const index = state.projects.findIndex(p => p._id === updatedProject._id);
      if (index !== -1) {
        state.projects[index] = updatedProject;
      }
    },
    addProjectToList: (state, action) => {
      state.projects.unshift(action.payload);
    },
    removeProjectFromList: (state, action) => {
      const projectId = action.payload;
      state.projects = state.projects.filter(p => p._id !== projectId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload.projects || action.payload;
        state.pagination = action.payload.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: (action.payload.projects || action.payload).length,
        };
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.projects = [];
      })
      // Get project
      .addCase(getProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentProject = action.payload.project || action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentProject = null;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newProject = action.payload.project || action.payload;
        state.projects.unshift(newProject);
        state.message = action.payload.message || 'Project created successfully';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedProject = action.payload.project || action.payload;
        
        // Update in projects list
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        // Update current project if it's the same
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        
        state.message = action.payload.message || 'Project updated successfully';
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const projectId = action.payload;
        state.projects = state.projects.filter(p => p._id !== projectId);
        
        if (state.currentProject && state.currentProject._id === projectId) {
          state.currentProject = null;
        }
        
        state.message = 'Project deleted successfully';
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add member
      .addCase(addMember.fulfilled, (state, action) => {
        state.isSuccess = true;
        const updatedProject = action.payload.project || action.payload;
        
        // Update current project
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        
        // Update in projects list
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        state.message = action.payload.message || 'Member added successfully';
      })
      .addCase(addMember.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Remove member
      .addCase(removeMember.fulfilled, (state, action) => {
        state.isSuccess = true;
        const updatedProject = action.payload.project || action.payload;
        
        // Update current project
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        
        // Update in projects list
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        state.message = action.payload.message || 'Member removed successfully';
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Toggle archive
      .addCase(toggleArchiveProject.fulfilled, (state, action) => {
        state.isSuccess = true;
        const updatedProject = action.payload.project || action.payload;
        
        // Update current project
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        
        // Update in projects list
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        state.message = action.payload.message || 'Project archived successfully';
      })
      .addCase(toggleArchiveProject.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Toggle favorite
      .addCase(toggleProjectFavorite.fulfilled, (state, action) => {
        state.isSuccess = true;
        const updatedProject = action.payload.project || action.payload;
        
        // Update current project
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        
        // Update in projects list
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        state.message = action.payload.message || 'Project favorite toggled successfully';
      })
      .addCase(toggleProjectFavorite.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  clearError,
  setFilters,
  clearFilters,
  setCurrentProject,
  clearCurrentProject,
  updateProjectInList,
  addProjectToList,
  removeProjectFromList,
} = projectSlice.actions;

export default projectSlice.reducer;