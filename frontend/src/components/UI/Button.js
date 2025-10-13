import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { PulseLoader } from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  neon = false,
  gradient = false,
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus:ring-secondary-500 dark:bg-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-600',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    ghost: 'bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-300 dark:hover:bg-secondary-800',
    outline: 'border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500 dark:border-secondary-600 dark:text-secondary-300 dark:hover:bg-secondary-800',
    neon: 'bg-transparent border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black focus:ring-neon-blue neon-glow hover:neon-glow-lg',
  };

  const gradientClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
    success: 'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800',
    danger: 'bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800',
    aurora: 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink hover:from-neon-purple hover:via-neon-pink hover:to-neon-blue',
  };

  const buttonClasses = clsx(
    baseClasses,
    sizeClasses[size],
    neon ? variantClasses.neon : (gradient ? gradientClasses[variant] || gradientClasses.primary : variantClasses[variant]),
    fullWidth && 'w-full',
    (loading || disabled) && 'pointer-events-none',
    className
  );

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      type={Component === 'button' ? type : undefined}
      className={buttonClasses}
      onClick={handleClick}
      disabled={loading || disabled}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading ? (
        <PulseLoader 
          size={size === 'xs' ? 'xs' : 'sm'} 
          color={neon ? 'neon' : (variant === 'ghost' || variant === 'outline') ? 'primary' : 'white'} 
        />
      ) : (
        <>
          {leftIcon && (
            <span className={clsx('flex-shrink-0', children && 'mr-2')}>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className={clsx('flex-shrink-0', children && 'ml-2')}>
              {rightIcon}
            </span>
          )}
        </>
      )}
    </MotionComponent>
  );
};

// Icon button variant
export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  neon = false,
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };

  return (
    <Button
      variant={variant}
      className={clsx('rounded-full', sizeClasses[size], className)}
      neon={neon}
      {...props}
    >
      {children}
    </Button>
  );
};

// Button group component
export const ButtonGroup = ({ 
  children, 
  className = '',
  orientation = 'horizontal',
  size = 'md',
  variant = 'secondary' 
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  return (
    <div className={clsx(
      'inline-flex',
      orientationClasses[orientation],
      orientation === 'horizontal' ? 'divide-x' : 'divide-y',
      'divide-secondary-300 dark:divide-secondary-600 rounded-lg overflow-hidden',
      className
    )}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: clsx(
              child.props.className,
              'rounded-none',
              index === 0 && (orientation === 'horizontal' ? 'rounded-l-lg' : 'rounded-t-lg'),
              index === React.Children.count(children) - 1 && (orientation === 'horizontal' ? 'rounded-r-lg' : 'rounded-b-lg')
            ),
            size: child.props.size || size,
            variant: child.props.variant || variant,
          });
        }
        return child;
      })}
    </div>
  );
};

// Floating action button
export const FloatingActionButton = ({
  children,
  className = '',
  position = 'bottom-right',
  neon = false,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <motion.div
      className={positionClasses[position]}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Button
        variant={neon ? 'neon' : 'primary'}
        size="lg"
        className={clsx(
          'rounded-full w-14 h-14 shadow-2xl',
          neon && 'animate-pulse',
          className
        )}
        neon={neon}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default Button;