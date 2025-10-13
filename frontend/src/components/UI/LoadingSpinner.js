import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = '',
  overlay = false,
  neon = false 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    danger: 'border-danger-600',
    white: 'border-white',
    neon: 'border-neon-blue',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinnerClasses = clsx(
    'border-2 border-t-transparent rounded-full animate-spin',
    sizeClasses[size],
    neon ? 'border-neon-blue neon-glow' : colorClasses[color],
    className
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <motion.div
        className={spinnerClasses}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <motion.p
          className={clsx(
            'text-secondary-600 dark:text-secondary-400 font-medium',
            textSizeClasses[size],
            neon && 'text-neon-blue neon-pulse'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-secondary-800 rounded-xl p-8 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return content;
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'rounded',
  animated = true 
}) => {
  return (
    <div
      className={clsx(
        'bg-secondary-200 dark:bg-secondary-700',
        width,
        height,
        rounded,
        animated && 'animate-pulse',
        className
      )}
    />
  );
};

// Pulse loader for buttons
export const PulseLoader = ({ size = 'sm', color = 'white' }) => {
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colorClasses = {
    white: 'bg-white',
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    neon: 'bg-neon-blue',
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={clsx(
            'rounded-full',
            dotSizes[size],
            colorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Progress bar loader
export const ProgressLoader = ({ 
  progress = 0, 
  className = '',
  color = 'primary',
  showPercentage = false,
  animated = true,
  neon = false 
}) => {
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
    neon: 'bg-neon-blue',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showPercentage && (
          <span className={clsx(
            'text-sm font-medium',
            neon ? 'text-neon-blue neon-pulse' : 'text-secondary-700 dark:text-secondary-300'
          )}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
        <motion.div
          className={clsx(
            'h-2 rounded-full',
            neon ? 'bg-neon-blue neon-glow' : colorClasses[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: 'easeOut' 
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;