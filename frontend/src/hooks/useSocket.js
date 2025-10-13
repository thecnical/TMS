import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useMemo } from 'react';
import {
  setConnected,
  addOnlineUser,
  removeOnlineUser,
  addNotification,
  setUserTyping,
  resetSocketState,
} from '../store/slices/socketSlice';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  emitSocketEvent,
} from '../services/socket';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { isConnected, onlineUsers, notifications, typingUsers } = useSelector(
    (state) => state.socket
  );
  const { user, token } = useSelector((state) => state.auth);

  // Mock notifications for development
  const mockNotifications = useMemo(() => [
    {
      id: '1',
      type: 'info',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Design Homepage"',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Task Completed',
      message: 'Task "API Integration" has been completed',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Deadline Approaching',
      message: 'Task "User Testing" is due in 2 days',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true,
    },
  ], []);

  // Connect socket
  const connect = useCallback(() => {
    if (user && token && !isConnected) {
      const socket = connectSocket(token);
      socket.on('connect', () => {
        dispatch(setConnected(true));
        socket.emit('join-user', user._id);
      });
      socket.on('disconnect', () => {
        dispatch(setConnected(false));
      });
      socket.on('user-online', (userId) => {
        dispatch(addOnlineUser(userId));
      });
      socket.on('user-offline', (userId) => {
        dispatch(removeOnlineUser(userId));
      });
      socket.on('notification', (notification) => {
        dispatch(addNotification(notification));
      });
      socket.on('user-typing', ({ userId, taskId, isTyping }) => {
        dispatch(setUserTyping({ userId, taskId, isTyping }));
      });
    }
  }, [dispatch, user, token, isConnected]);

  // Disconnect socket
  const disconnect = useCallback(() => {
    disconnectSocket();
    dispatch(setConnected(false));
    dispatch(resetSocketState());
  }, [dispatch]);

  // Emit event
  const emit = useCallback((event, data) => {
    if (isConnected) {
      emitSocketEvent(event, data);
    }
  }, [isConnected]);

  // Join/leave room
  const join = useCallback((room) => {
    emit('join-room', room);
  }, [emit]);
  const leave = useCallback((room) => {
    emit('leave-room', room);
  }, [emit]);

  // Join/leave project room
  const joinProject = useCallback((projectId) => {
    join(`project-${projectId}`);
  }, [join]);
  const leaveProject = useCallback((projectId) => {
    leave(`project-${projectId}`);
  }, [leave]);

  // Emit task events
  const emitTaskUpdate = useCallback((taskData) => {
    emit('task-updated', taskData);
  }, [emit]);
  const emitTaskCreated = useCallback((taskData) => {
    emit('task-created', taskData);
  }, [emit]);
  const emitTaskDeleted = useCallback((taskData) => {
    emit('task-deleted', taskData);
  }, [emit]);
  const emitCommentAdded = useCallback((commentData) => {
    emit('comment-added', commentData);
  }, [emit]);

  // Send notification
  const sendNotification = useCallback((userId, notification) => {
    emit('send-notification', { userId, ...notification });
  }, [emit]);

  // Typing indicator
  const emitTyping = useCallback((projectId, taskId, isTyping) => {
    emit('typing', { projectId, taskId, isTyping });
  }, [emit]);

  // Online/typing helpers
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);
  const getTypingUsers = useCallback((taskId) => {
    return typingUsers[taskId] || [];
  }, [typingUsers]);
  const getUnreadCount = useCallback(() => {
    // Use mock notifications if no real notifications
    const notificationsToUse = notifications.length > 0 ? notifications : mockNotifications;
    return notificationsToUse.filter((n) => !n.read).length;
  }, [notifications, mockNotifications]);

  // Auto-connect/disconnect on user change
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [user, token, connect, disconnect]);

  return {
    socket: getSocket(),
    isConnected,
    onlineUsers,
    notifications: notifications.length > 0 ? notifications : mockNotifications,
    typingUsers,
    connect,
    disconnect,
    emit,
    join,
    leave,
    joinProject,
    leaveProject,
    emitTaskUpdate,
    emitTaskCreated,
    emitTaskDeleted,
    emitCommentAdded,
    sendNotification,
    emitTyping,
    isUserOnline,
    getTypingUsers,
    getUnreadCount,
  };
};