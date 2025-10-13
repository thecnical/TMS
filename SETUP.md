# TaskFlow - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download here](https://git-scm.com/)

### Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables
Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_APP_NAME=TaskFlow
REACT_APP_VERSION=1.0.0
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🏃‍♂️ Running the Application

### Development Mode

#### Option 1: Using Batch File (Windows)
```bash
start.bat
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Option 3: Concurrent Start (from root)
```bash
npm run dev
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs (coming soon)

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskflow.com | password123 |
| Manager | manager@taskflow.com | password123 |
| Member | member@taskflow.com | password123 |

## 📁 Project Structure

```
TaskFlow/
├── backend/                 # Backend application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── uploads/           # File uploads
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
├── frontend/              # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS files
│   ├── .env              # Frontend environment
│   └── package.json      # Frontend dependencies
├── install.bat           # Windows installation script
├── start.bat             # Windows start script
├── package.json          # Root package.json
└── README.md             # Main documentation
```

## 🎨 Features Overview

### ✅ Implemented Features
- **Authentication System** - Login/Register with JWT
- **Dashboard** - Overview with statistics and charts
- **Project Management** - Create, view, and manage projects
- **Task Management** - Kanban board with drag-and-drop
- **Analytics** - Charts and performance metrics
- **Real-time Updates** - Socket.io integration
- **Responsive Design** - Works on all devices
- **Dark/Light Theme** - Automatic theme switching
- **Modern UI** - Glass morphism and neon effects
- **Animations** - Smooth transitions with Framer Motion

### 🚧 Coming Soon
- Task detail pages with comments
- Project detail pages with team management
- File upload and attachments
- Time tracking
- Email notifications
- Advanced user roles and permissions
- Team collaboration features
- Advanced analytics and reporting

## 🛠️ Development

### Available Scripts

#### Root Directory
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run install-all  # Install all dependencies
```

#### Backend
```bash
npm start           # Start production server
npm run dev         # Start development server
npm run seed        # Seed database with demo data
npm test            # Run tests
```

#### Frontend
```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run analyze     # Analyze bundle size
```

### Code Style
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **Component-based architecture**

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000
```

#### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. Verify network connectivity for Atlas

#### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Issues
```bash
# Clear React cache
rm -rf node_modules/.cache
npm start
```

### Getting Help
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review the logs in terminal

## 🔒 Security Notes

### Development
- Default JWT secret is for development only
- Demo accounts are for testing purposes
- CORS is configured for localhost

### Production
- Change all default passwords
- Use strong JWT secrets
- Configure proper CORS origins
- Enable HTTPS
- Set up proper database security
- Configure rate limiting
- Enable security headers

## 📈 Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize images and assets
- Use code splitting

### Backend
- Implement database indexing
- Use caching for frequent queries
- Optimize API responses
- Monitor memory usage

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

### Backend (Heroku/Railway)
1. Set environment variables
2. Configure database connection
3. Deploy from repository

### Database (MongoDB Atlas)
1. Create production cluster
2. Configure network access
3. Set up database users

## 📞 Support

For issues and questions:
1. Check this documentation
2. Review error messages
3. Check GitHub issues
4. Contact support team

---

**Happy coding! 🎉**