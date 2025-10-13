import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

import { toggleNotificationPanel } from '../../store/slices/uiSlice';
import { useSocket } from '../../hooks/useSocket';
import Button, { IconButton } from '../UI/Button';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const { notificationPanelOpen } = useSelector((state) => state.ui);
  const { notifications } = useSocket();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
  };

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => dispatch(toggleNotificationPanel())}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-secondary-800 shadow-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                    <BellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      Notifications
                    </h2>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {notifications.filter(n => !n.read).length} unread
                    </p>
                  </div>
                </div>
                
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(toggleNotificationPanel())}
                >
                  <XMarkIcon className="w-5 h-5" />
                </IconButton>
              </div>

              {/* Actions */}
              <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Mark All Read
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full p-8 text-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-4">
                      <BellIcon className="w-8 h-8 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                      No notifications
                    </h3>
                    <p className="text-secondary-500 dark:text-secondary-400">
                      You're all caught up! Check back later for updates.
                    </p>
                  </motion.div>
                ) : (
                  <div className="p-4 space-y-3">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                          !notification.read ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
                        }`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-secondary-500 dark:text-secondary-500">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                              {notification.actionUrl && (
                                <Button size="xs" variant="ghost">
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
                <Button fullWidth variant="outline" size="sm">
                  View All Notifications
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;