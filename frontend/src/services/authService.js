import { apiRequest } from './api';

const MOCK_MODE = true; // Set to false when backend is available

const authService = {
  // Register user
  register: async (userData) => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        _id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        title: 'Team Member',
        department: 'General',
        role: 'member',
        isActive: true,
        permissions: ['read', 'write'],
        createdAt: new Date().toISOString(),
        avatar: null,
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return {
        user: mockUser,
        token: mockToken,
        message: 'Registration successful'
      };
    }
    
    const response = await apiRequest.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
    }
    
    return response.data;
  },

  // Login user
  login: async (userData) => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        _id: '1',
        name: 'John Doe',
        email: userData.email,
        title: 'Project Manager',
        department: 'Engineering',
        role: 'admin',
        isActive: true,
        permissions: ['read', 'write', 'delete', 'admin'],
        createdAt: '2024-01-01T00:00:00.000Z',
        avatar: null,
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return {
        user: mockUser,
        token: mockToken,
        message: 'Login successful'
      };
    }
    
    const response = await apiRequest.post('/auth/login', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
    }
    
    return response.data;
  },

  // Guest login
  guestLogin: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock guest user
    const guestUser = {
      _id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@taskflow.com',
      title: 'Guest',
      department: 'General',
      role: 'member',
      isActive: true,
      permissions: ['read', 'write'],
      createdAt: new Date().toISOString(),
      avatar: null,
      isGuest: true,
    };
    
    const mockToken = 'guest-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(guestUser));
    
    return {
      user: guestUser,
      token: mockToken,
      message: 'Guest login successful'
    };
  },

  // Get current user
  getMe: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return { user };
    }
    
    const response = await apiRequest.get('/auth/me');
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await apiRequest.put('/auth/profile', userData);
    
    if (response.data.user || response.data._id) {
      const updatedUser = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiRequest.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
    
    try {
      await apiRequest.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiRequest.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await apiRequest.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiRequest.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async () => {
    const response = await apiRequest.post('/auth/resend-verification');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  // Clear stored auth data
  clearStoredAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;