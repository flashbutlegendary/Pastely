import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, wrapperClassName = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`input-base ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${
              error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <span className="absolute right-4 text-muted flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-500 font-medium ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
