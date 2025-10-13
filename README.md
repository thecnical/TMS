<<<<<<< HEAD
# TaskFlow - Collaborative Task Management System

A modern, feature-rich task management system built with React, Redux, Node.js, MongoDB, and Socket.io. Features real-time collaboration, stunning UI with animations, user roles, and comprehensive analytics.

## ✨ Features

### 🚀 Core Features
- **Real-time Collaboration** - Live updates with Socket.io
- **User Role Management** - Admin, Manager, and Member roles
- **Project Management** - Create and manage projects with teams
- **Task Management** - Full CRUD operations with drag-and-drop
- **Analytics Dashboard** - Comprehensive insights and reporting
- **Time Tracking** - Built-in time tracking for tasks
- **File Attachments** - Upload and manage task attachments
- **Comments System** - Real-time commenting on tasks

### 🎨 UI/UX Features
- **Stunning Modern Design** - Glass morphism and neon effects
- **Dark/Light Theme** - Automatic theme switching
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered animations
- **Interactive Elements** - Hover effects and micro-interactions
- **Loading States** - Beautiful loading spinners and skeletons

### 🔧 Technical Features
- **Real-time Updates** - Socket.io integration
- **State Management** - Redux Toolkit
- **Authentication** - JWT-based auth system
- **File Upload** - Multer integration
- **Email Notifications** - Nodemailer integration
- **Data Validation** - Express-validator
- **Error Handling** - Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskflow.git
   cd taskflow
   ```

2. **Run the installation script**
   ```bash
   # On Windows
   install.bat
   
   # On macOS/Linux
   chmod +x install.sh
   ./install.sh
   ```

3. **Configure environment variables**
   
   Update `backend/.env` with your settings:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**
   ```bash
   # On Windows
   start.bat
   
   # On macOS/Linux
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

Use these credentials to test the application:

- **Admin**: admin@taskflow.com / password123
- **Manager**: manager@taskflow.com / password123
- **Member**: member@taskflow.com / password123

## 📱 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Project Management
![Projects](screenshots/projects.png)

### Task Board
![Tasks](screenshots/tasks.png)

### Analytics
![Analytics](screenshots/analytics.png)

## 🏗️ Project Structure

```
taskflow/
├── backend/                 # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── install.bat             # Windows installation script
├── start.bat               # Windows start script
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

#### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎨 Customization

### Themes
The application supports custom themes. Edit `frontend/tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      neon: {
        blue: '#00f5ff',
        purple: '#bf00ff',
        pink: '#ff0080',
        // Add more neon colors
      }
    }
  }
}
```

### Animations
Animations are powered by Framer Motion. Customize in `frontend/src/index.css`:

```css
@keyframes yourAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Project Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- XSS protection
- SQL injection prevention

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables in your hosting dashboard

### Backend (Heroku/Railway)
1. Create a new app on your hosting service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from the `backend` directory

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Socket.io](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/taskflow/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact us at support@taskflow.com

---

=======
# TaskFlow - Collaborative Task Management System

A modern, feature-rich task management system built with React, Redux, Node.js, MongoDB, and Socket.io. Features real-time collaboration, stunning UI with animations, user roles, and comprehensive analytics.

## ✨ Features

### 🚀 Core Features
- **Real-time Collaboration** - Live updates with Socket.io
- **User Role Management** - Admin, Manager, and Member roles
- **Project Management** - Create and manage projects with teams
- **Task Management** - Full CRUD operations with drag-and-drop
- **Analytics Dashboard** - Comprehensive insights and reporting
- **Time Tracking** - Built-in time tracking for tasks
- **File Attachments** - Upload and manage task attachments
- **Comments System** - Real-time commenting on tasks

### 🎨 UI/UX Features
- **Stunning Modern Design** - Glass morphism and neon effects
- **Dark/Light Theme** - Automatic theme switching
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered animations
- **Interactive Elements** - Hover effects and micro-interactions
- **Loading States** - Beautiful loading spinners and skeletons

### 🔧 Technical Features
- **Real-time Updates** - Socket.io integration
- **State Management** - Redux Toolkit
- **Authentication** - JWT-based auth system
- **File Upload** - Multer integration
- **Email Notifications** - Nodemailer integration
- **Data Validation** - Express-validator
- **Error Handling** - Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskflow.git
   cd taskflow
   ```

2. **Run the installation script**
   ```bash
   # On Windows
   install.bat
   
   # On macOS/Linux
   chmod +x install.sh
   ./install.sh
   ```

3. **Configure environment variables**
   
   Update `backend/.env` with your settings:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**
   ```bash
   # On Windows
   start.bat
   
   # On macOS/Linux
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

Use these credentials to test the application:

- **Admin**: admin@taskflow.com / password123
- **Manager**: manager@taskflow.com / password123
- **Member**: member@taskflow.com / password123

## 📱 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Project Management
![Projects](screenshots/projects.png)

### Task Board
![Tasks](screenshots/tasks.png)

### Analytics
![Analytics](screenshots/analytics.png)

## 🏗️ Project Structure

```
taskflow/
├── backend/                 # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── install.bat             # Windows installation script
├── start.bat               # Windows start script
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

#### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎨 Customization

### Themes
The application supports custom themes. Edit `frontend/tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      neon: {
        blue: '#00f5ff',
        purple: '#bf00ff',
        pink: '#ff0080',
        // Add more neon colors
      }
    }
  }
}
```

### Animations
Animations are powered by Framer Motion. Customize in `frontend/src/index.css`:

```css
@keyframes yourAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Project Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- XSS protection
- SQL injection prevention

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables in your hosting dashboard

### Backend (Heroku/Railway)
1. Create a new app on your hosting service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from the `backend` directory

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Socket.io](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/taskflow/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact us at support@taskflow.com

---

>>>>>>> 973742af3377736e3e652474c1aa6c4cc858ed7e
Made with ❤️ by the TaskFlow Team