import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Sidebar from './Sidebar';
import Header from './Header';
import MobileMenu from './MobileMenu';
import NotificationPanel from './NotificationPanel';
import CommandPalette from './CommandPalette';

// Redux actions
import { initializeUI } from '../../store/slices/uiSlice';

// Hooks
import { useSocket } from '../../hooks/useSocket';

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { 
    sidebarOpen, 
    sidebarCollapsed, 
    mobileMenuOpen,
    theme,
    layout 
  } = useSelector((state) => state.ui);
  
  const { user } = useSelector((state) => state.auth);
  
  // Initialize socket connection
  const { connect, isConnected } = useSocket();

  useEffect(() => {
    // Initialize UI settings
    dispatch(initializeUI());
    
    // Connect to socket if user is authenticated
    if (user && !isConnected) {
      connect();
    }
  }, [dispatch, user, isConnected, connect]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Mobile/tablet view
        dispatch({ type: 'ui/setSidebarOpen', payload: false });
      } else {
        // Desktop view
        dispatch({ type: 'ui/setSidebarOpen', payload: true });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const layoutVariants = {
    expanded: {
      marginLeft: sidebarCollapsed ? '4rem' : '16rem',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: layout.animation ? 0.3 : 0
      }
    },
    collapsed: {
      marginLeft: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: layout.animation ? 0.3 : 0
      }
    }
  };

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: layout.animation ? 0.3 : 0,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: layout.animation ? 0.2 : 0,
        ease: 'easeIn'
      }
    }
  };

  return (
    <div className={`min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200 ${theme}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div
        className="flex flex-col min-h-screen lg:transition-all lg:duration-300"
        variants={layoutVariants}
        animate={sidebarOpen && window.innerWidth >= 1024 ? 'expanded' : 'collapsed'}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          </div>

          {/* Content Container */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="container mx-auto px-4 sm:px-6 lg:px-8 py-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Elements */}
          <div className="fixed bottom-6 right-6 z-40 space-y-3">
            {/* Scroll to Top Button */}
            <motion.button
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          </div>
        </main>
      </motion.div>

      {/* Notification Panel */}
      <NotificationPanel />

      {/* Command Palette */}
      <CommandPalette />

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {/* Add global loading state here if needed */}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'glass-card',
          style: {
            background: theme === 'dark' 
              ? 'rgba(30, 41, 59, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            backdropFilter: 'blur(10px)',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Keyboard Shortcuts Helper */}
      {layout.keyboardShortcuts && (
        <div className="fixed bottom-4 left-4 z-30">
          <motion.div
            className="text-xs text-secondary-500 dark:text-secondary-400 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            Press <kbd className="px-1.5 py-0.5 bg-secondary-200 dark:bg-secondary-700 rounded text-xs">Ctrl+K</kbd> for commands
          </motion.div>
        </div>
      )}

      {/* Development Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-warning-500 text-white px-3 py-1 text-xs font-medium rounded-b-lg">
            Development Mode
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;