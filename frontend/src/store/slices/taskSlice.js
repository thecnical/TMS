import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

const initialState = {
  tasks: [],
  currentTask: null,
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
    assignedTo: '',
    project: '',
    dueDate: '',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Get all tasks
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (params = {}, thunkAPI) => {
    try {
      return await taskService.getTasks(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch tasks';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get task by ID
export const getTask = createAsyncThunk(
  'tasks/getById',
  async (id, thunkAPI) => {
    try {
      return await taskService.getTask(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch task';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create task';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, taskData }, thunkAPI) => {
    try {
      return await taskService.updateTask(id, taskData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update task';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete task';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add comment to task
export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, commentData }, thunkAPI) => {
    try {
      return await taskService.addComment(taskId, commentData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add comment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add time tracking entry
export const addTimeEntry = createAsyncThunk(
  'tasks/addTimeEntry',
  async ({ taskId, timeData }, thunkAPI) => {
    try {
      return await taskService.addTimeEntry(taskId, timeData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add time entry';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get tasks by project
export const getTasksByProject = createAsyncThunk(
  'tasks/getByProject',
  async ({ projectId, params = {} }, thunkAPI) => {
    try {
      return await taskService.getTasksByProject(projectId, params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch project tasks';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reorder tasks
export const reorderTasks = createAsyncThunk(
  'tasks/reorder',
  async (tasks, thunkAPI) => {
    try {
      return await taskService.reorderTasks(tasks);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reorder tasks';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
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
        assignedTo: '',
        project: '',
        dueDate: '',
      };
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    updateTaskInList: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(t => t._id === updatedTask._id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
    addTaskToList: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    removeTaskFromList: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(t => t._id !== taskId);
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find(t => t._id === taskId);
      if (task) {
        task.status = status;
        if (status === 'completed') {
          task.completedAt = new Date().toISOString();
          task.progress = 100;
        }
      }
      
      if (state.currentTask && state.currentTask._id === taskId) {
        state.currentTask.status = status;
        if (status === 'completed') {
          state.currentTask.completedAt = new Date().toISOString();
          state.currentTask.progress = 100;
        }
      }
    },
    updateTaskProgress: (state, action) => {
      const { taskId, progress } = action.payload;
      const task = state.tasks.find(t => t._id === taskId);
      if (task) {
        task.progress = progress;
        
        // Auto-update status based on progress
        if (progress === 100 && task.status !== 'completed') {
          task.status = 'completed';
          task.completedAt = new Date().toISOString();
        } else if (progress > 0 && progress < 100 && task.status === 'todo') {
          task.status = 'in-progress';
        }
      }
      
      if (state.currentTask && state.currentTask._id === taskId) {
        state.currentTask.progress = progress;
        
        if (progress === 100 && state.currentTask.status !== 'completed') {
          state.currentTask.status = 'completed';
          state.currentTask.completedAt = new Date().toISOString();
        } else if (progress > 0 && progress < 100 && state.currentTask.status === 'todo') {
          state.currentTask.status = 'in-progress';
        }
      }
    },
    reorderTasksLocally: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload.tasks || action.payload;
        state.pagination = action.payload.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: (action.payload.tasks || action.payload).length,
        };
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.tasks = [];
      })
      // Get task
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTask = action.payload.task || action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentTask = null;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newTask = action.payload.task || action.payload;
        state.tasks.unshift(newTask);
        state.message = action.payload.message || 'Task created successfully';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedTask = action.payload.task || action.payload;
        
        // Update in tasks list
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        
        // Update current task if it's the same
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
        
        state.message = action.payload.message || 'Task updated successfully';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const taskId = action.payload;
        state.tasks = state.tasks.filter(t => t._id !== taskId);
        
        if (state.currentTask && state.currentTask._id === taskId) {
          state.currentTask = null;
        }
        
        state.message = 'Task deleted successfully';
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        const { comments } = action.payload;
        
        if (state.currentTask) {
          state.currentTask.comments = comments;
        }
        
        state.message = action.payload.message || 'Comment added successfully';
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Add time entry
      .addCase(addTimeEntry.fulfilled, (state, action) => {
        state.isSuccess = true;
        const { timeTracking, actualHours } = action.payload;
        
        if (state.currentTask) {
          state.currentTask.timeTracking = timeTracking;
          state.currentTask.actualHours = actualHours;
        }
        
        state.message = action.payload.message || 'Time entry added successfully';
      })
      .addCase(addTimeEntry.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Get tasks by project
      .addCase(getTasksByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasksByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.tasks = [];
      })
      // Reorder tasks
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload.message || 'Tasks reordered successfully';
      })
      .addCase(reorderTasks.rejected, (state, action) => {
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
  setSorting,
  setCurrentTask,
  clearCurrentTask,
  updateTaskInList,
  addTaskToList,
  removeTaskFromList,
  updateTaskStatus,
  updateTaskProgress,
  reorderTasksLocally,
} = taskSlice.actions;

export default taskSlice.reducer;