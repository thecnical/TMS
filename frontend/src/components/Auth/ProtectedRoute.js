import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { user, isLoading, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Check if user has sufficient privileges
    const roleHierarchy = {
      member: 1,
      manager: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-500">
              Required role: {requiredRole} | Your role: {user.role}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check permission-based access
  if (requiredPermission && user.permissions && !user.permissions.includes(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Insufficient Permissions
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            You don't have the required permission to access this page.
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-500">
            Required permission: {requiredPermission}
          </p>
        </div>
      </div>
    );
  }

  // Check if user account is active
  if (user.isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⏸️</div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Account Deactivated
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Your account has been deactivated. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Higher-order component for permission-based protection
export const withPermissionProtection = (Component, requiredPermission) => {
  return (props) => (
    <ProtectedRoute requiredPermission={requiredPermission}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Hook for checking user permissions
export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  const hasRole = (role) => {
    if (!user) return false;
    
    const roleHierarchy = {
      member: 1,
      manager: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = () => hasRole('admin');
  const isManager = () => hasRole('manager');
  const isMember = () => hasRole('member');

  return {
    user,
    hasRole,
    hasPermission,
    isAdmin,
    isManager,
    isMember,
  };
};

export default ProtectedRoute;