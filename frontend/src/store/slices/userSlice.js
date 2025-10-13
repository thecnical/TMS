import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  users: [],
  currentUser: null,
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
    role: '',
    department: '',
    isActive: '',
  },
};

// Get all users
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (params = {}, thunkAPI) => {
    try {
      return await userService.getUsers(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by ID
export const getUser = createAsyncThunk(
  'users/getById',
  async (id, thunkAPI) => {
    try {
      return await userService.getUser(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, userData }, thunkAPI) => {
    try {
      return await userService.updateUser(id, userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user dashboard
export const getUserDashboard = createAsyncThunk(
  'users/getDashboard',
  async (id, thunkAPI) => {
    try {
      return await userService.getUserDashboard(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard data';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'users/search',
  async ({ query, limit = 10 }, thunkAPI) => {
    try {
      return await userService.searchUsers(query, limit);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to search users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
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
        role: '',
        department: '',
        isActive: '',
      };
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    updateUserInList: (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(u => u._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    addUserToList: (state, action) => {
      state.users.unshift(action.payload);
    },
    removeUserFromList: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter(u => u._id !== userId);
    },
    setUserOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      const user = state.users.find(u => u._id === userId);
      if (user) {
        user.isOnline = isOnline;
        user.lastSeen = isOnline ? new Date().toISOString() : user.lastSeen;
      }
      
      if (state.currentUser && state.currentUser._id === userId) {
        state.currentUser.isOnline = isOnline;
        state.currentUser.lastSeen = isOnline ? new Date().toISOString() : state.currentUser.lastSeen;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.users || action.payload;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || state.users.length,
        };
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.users = [];
      })
      // Get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentUser = action.payload.user || action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentUser = null;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedUser = action.payload.user || action.payload;
        
        // Update in users list
        const index = state.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        
        // Update current user if it's the same
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
        
        state.message = action.payload.message || 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const userId = action.payload;
        state.users = state.users.filter(u => u._id !== userId);
        
        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser = null;
        }
        
        state.message = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user dashboard
      .addCase(getUserDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getUserDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Dashboard data is typically handled in a separate slice or component state
      })
      .addCase(getUserDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Search results are typically handled separately
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
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
  setCurrentUser,
  clearCurrentUser,
  updateUserInList,
  addUserToList,
  removeUserFromList,
  setUserOnlineStatus,
} = userSlice.actions;

export default userSlice.reducer;