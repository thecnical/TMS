const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Socket.io connection handling
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join user to their rooms
  socket.on('join-user', (userId) => {
    activeUsers.set(socket.id, userId);
    socket.join(`user-${userId}`);
    
    // Broadcast user online status
    socket.broadcast.emit('user-online', userId);
  });

  // Join project room
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    socket.to(`project-${data.projectId}`).emit('task-updated', data);
  });

  // Handle new task creation
  socket.on('task-created', (data) => {
    socket.to(`project-${data.projectId}`).emit('task-created', data);
  });

  // Handle task deletion
  socket.on('task-deleted', (data) => {
    socket.to(`project-${data.projectId}`).emit('task-deleted', data);
  });

  // Handle comments
  socket.on('comment-added', (data) => {
    socket.to(`project-${data.projectId}`).emit('comment-added', data);
  });

  // Handle notifications
  socket.on('send-notification', (data) => {
    socket.to(`user-${data.userId}`).emit('notification', data);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(`project-${data.projectId}`).emit('user-typing', {
      userId: activeUsers.get(socket.id),
      taskId: data.taskId,
      isTyping: data.isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = activeUsers.get(socket.id);
    if (userId) {
      socket.broadcast.emit('user-offline', userId);
      activeUsers.delete(socket.id);
    }
    console.log('👤 User disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Socket.io server ready`);
});

module.exports = { app, io };