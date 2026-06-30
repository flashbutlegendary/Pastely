import React from 'react';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../animations/variants';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    // Style configurations
    const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';
    
    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-sm hover:shadow-glow',
      secondary: 'bg-surface-200 hover:bg-surface-300 text-primary border border-surface-400 hover:border-surface-500',
      ghost: 'bg-transparent hover:bg-surface-200 text-secondary hover:text-primary',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 gap-1.5',
      md: 'text-sm px-5 py-3 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
    };

    const combinedClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : 'tap'}
        variants={buttonTapVariants}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...(props as any)}
      >
        {isLoading && <Spinner className="w-4 h-4 mr-1 text-current" />}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
