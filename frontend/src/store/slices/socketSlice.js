import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  onlineUsers: [],
  notifications: [],
  typingUsers: {},
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    addOnlineUser: (state, action) => {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    removeOnlineUser: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false,
      });
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setUserTyping: (state, action) => {
      const { userId, taskId, isTyping } = action.payload;
      if (!state.typingUsers[taskId]) {
        state.typingUsers[taskId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[taskId].includes(userId)) {
          state.typingUsers[taskId].push(userId);
        }
      } else {
        state.typingUsers[taskId] = state.typingUsers[taskId].filter(id => id !== userId);
        if (state.typingUsers[taskId].length === 0) {
          delete state.typingUsers[taskId];
        }
      }
    },
    resetSocketState: (state) => {
      state.isConnected = false;
      state.onlineUsers = [];
      state.notifications = [];
      state.typingUsers = {};
    },
  },
});

export const {
  setConnected,
  addOnlineUser,
  removeOnlineUser,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  setUserTyping,
  resetSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;