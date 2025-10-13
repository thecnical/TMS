import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

const initialState = {
  dashboardData: null,
  projectAnalytics: null,
  userAnalytics: null,
  teamAnalytics: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  timeRange: '30', // days
};

// Get dashboard analytics
export const getDashboardAnalytics = createAsyncThunk(
  'analytics/getDashboard',
  async (timeRange = '30', thunkAPI) => {
    try {
      return await analyticsService.getDashboardAnalytics(timeRange);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project analytics
export const getProjectAnalytics = createAsyncThunk(
  'analytics/getProject',
  async (projectId, thunkAPI) => {
    try {
      return await analyticsService.getProjectAnalytics(projectId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch project analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user analytics
export const getUserAnalytics = createAsyncThunk(
  'analytics/getUser',
  async (userId, thunkAPI) => {
    try {
      return await analyticsService.getUserAnalytics(userId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get team analytics
export const getTeamAnalytics = createAsyncThunk(
  'analytics/getTeam',
  async (timeRange = '30', thunkAPI) => {
    try {
      return await analyticsService.getTeamAnalytics(timeRange);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch team analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const analyticsSlice = createSlice({
  name: 'analytics',
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
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
    },
    clearProjectAnalytics: (state) => {
      state.projectAnalytics = null;
    },
    clearUserAnalytics: (state) => {
      state.userAnalytics = null;
    },
    clearTeamAnalytics: (state) => {
      state.teamAnalytics = null;
    },
    clearAllAnalytics: (state) => {
      state.dashboardData = null;
      state.projectAnalytics = null;
      state.userAnalytics = null;
      state.teamAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard analytics
      .addCase(getDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardData = action.payload.analytics || action.payload;
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.dashboardData = null;
      })
      // Get project analytics
      .addCase(getProjectAnalytics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getProjectAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projectAnalytics = action.payload;
      })
      .addCase(getProjectAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.projectAnalytics = null;
      })
      // Get user analytics
      .addCase(getUserAnalytics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userAnalytics = action.payload;
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userAnalytics = null;
      })
      // Get team analytics
      .addCase(getTeamAnalytics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getTeamAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.teamAnalytics = action.payload;
      })
      .addCase(getTeamAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.teamAnalytics = null;
      });
  },
});

export const {
  reset,
  clearError,
  setTimeRange,
  clearDashboardData,
  clearProjectAnalytics,
  clearUserAnalytics,
  clearTeamAnalytics,
  clearAllAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;