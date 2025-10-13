<<<<<<< HEAD
# Deployment Guide

This guide will help you deploy the TaskFlow application to Netlify (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Netlify account
- Railway account
- MongoDB Atlas account (for production database)

## Frontend Deployment (Netlify)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `frontend` folder as the base directory
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app`

## Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" > "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder
   - Railway will automatically detect it's a Node.js project

2. **Configure Environment Variables**
   - In Railway dashboard, go to Variables tab
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tms
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-netlify-site.netlify.app
     JWT_SECRET=your-super-secret-jwt-key-here
     ```

3. **Set up MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Create a database user
   - Whitelist Railway's IP addresses (0.0.0.0/0 for all)
   - Get your connection string and use it as MONGODB_URI

## Guest Login

The application now includes a guest login feature:
- Users can click "Continue as Guest" on the login page
- This bypasses authentication and provides a demo experience
- Guest users have limited permissions (read/write only)

## Post-Deployment

1. **Update Frontend API URL**
   - After getting your Railway backend URL, update the frontend environment variable
   - Redeploy the frontend on Netlify

2. **Test the Application**
   - Visit your Netlify URL
   - Try the guest login feature
   - Test creating projects and tasks

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in Railway
   - Check that the frontend URL matches exactly

2. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check that IP whitelist includes 0.0.0.0/0

3. **Build Failures**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible

### Environment Variables Reference

**Frontend (Netlify)**
- `REACT_APP_API_URL`: Backend API URL

**Backend (Railway)**
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (Railway sets this automatically)
- `NODE_ENV`: Environment (production)
- `FRONTEND_URL`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens

## Support

If you encounter any issues during deployment, please check:
1. Railway logs in the dashboard
2. Netlify build logs
3. Browser console for frontend errors
4. Network tab for API call failures
=======
# Deployment Guide

This guide will help you deploy the TaskFlow application to Netlify (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Netlify account
- Railway account
- MongoDB Atlas account (for production database)

## Frontend Deployment (Netlify)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `frontend` folder as the base directory
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app`

## Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" > "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder
   - Railway will automatically detect it's a Node.js project

2. **Configure Environment Variables**
   - In Railway dashboard, go to Variables tab
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tms
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-netlify-site.netlify.app
     JWT_SECRET=your-super-secret-jwt-key-here
     ```

3. **Set up MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Create a database user
   - Whitelist Railway's IP addresses (0.0.0.0/0 for all)
   - Get your connection string and use it as MONGODB_URI

## Guest Login

The application now includes a guest login feature:
- Users can click "Continue as Guest" on the login page
- This bypasses authentication and provides a demo experience
- Guest users have limited permissions (read/write only)

## Post-Deployment

1. **Update Frontend API URL**
   - After getting your Railway backend URL, update the frontend environment variable
   - Redeploy the frontend on Netlify

2. **Test the Application**
   - Visit your Netlify URL
   - Try the guest login feature
   - Test creating projects and tasks

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in Railway
   - Check that the frontend URL matches exactly

2. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check that IP whitelist includes 0.0.0.0/0

3. **Build Failures**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible

### Environment Variables Reference

**Frontend (Netlify)**
- `REACT_APP_API_URL`: Backend API URL

**Backend (Railway)**
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (Railway sets this automatically)
- `NODE_ENV`: Environment (production)
- `FRONTEND_URL`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens

## Support

If you encounter any issues during deployment, please check:
1. Railway logs in the dashboard
2. Netlify build logs
3. Browser console for frontend errors
4. Network tab for API call failures
>>>>>>> 973742af3377736e3e652474c1aa6c4cc858ed7e
