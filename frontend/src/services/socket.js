import io from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    const serverUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socket = io(serverUrl, {
      auth: { token },
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const offSocketEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const emitSocketEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
}; 