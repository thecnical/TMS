import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  HomeIcon,
  FolderIcon,
  CheckIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { logout } from '../../store/slices/authSlice';
import { toggleMobileMenu } from '../../store/slices/uiSlice';
import { IconButton } from '../UI/Button';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { mobileMenuOpen } = useSelector((state) => state.ui);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Tasks', href: '/tasks', icon: CheckIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Team', href: '/team', icon: UsersIcon },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(toggleMobileMenu());
  };

  const handleLinkClick = () => {
    dispatch(toggleMobileMenu());
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => dispatch(toggleMobileMenu())}
          />

          {/* Menu */}
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-secondary-800 shadow-2xl lg:hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-secondary-900 dark:text-white aurora-text">
                      TaskFlow
                    </h1>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Mobile Menu
                    </p>
                  </div>
                </div>
                
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </IconButton>
              </div>

              {/* User Info */}
              <motion.div
                className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-b border-secondary-200 dark:border-secondary-700"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {user?.name}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {user?.email}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mt-1">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="flex-1 p-6 space-y-2">
                {navigation.map((item, index) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg neon-glow'
                            : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                        <span className="ml-4 font-medium text-base">
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-secondary-200 dark:border-secondary-700 space-y-2">
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center px-4 py-3 rounded-xl text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white transition-all duration-200"
                  >
                    <UserIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="ml-4 font-medium">Profile</span>
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.45 }}
                >
                  <Link
                    to="/settings"
                    onClick={handleLinkClick}
                    className="flex items-center px-4 py-3 rounded-xl text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white transition-all duration-200"
                  >
                    <CogIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="ml-4 font-medium">Settings</span>
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <ArrowLeftOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="ml-4 font-medium">Logout</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;