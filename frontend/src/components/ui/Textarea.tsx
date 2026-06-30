import React from 'react';
import { Upload } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  characterCount?: number;
  maxLength?: number;
  isDragging?: boolean;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, characterCount, maxLength, isDragging = false, wrapperClassName = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`w-full flex flex-col gap-1.5 relative ${wrapperClassName}`}>
        <div className="flex justify-between items-center ml-1">
          {label && (
            <label htmlFor={textareaId} className="text-xs font-semibold text-secondary tracking-wider uppercase">
              {label}
            </label>
          )}
          {maxLength && typeof characterCount === 'number' && (
            <span className={`text-[10px] font-mono ${characterCount > maxLength ? 'text-red-500 font-bold' : 'text-muted'}`}>
              {characterCount.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          )}
        </div>

        <div className="relative rounded-xl overflow-hidden">
          <textarea
            ref={ref}
            id={textareaId}
            maxLength={maxLength}
            className={`input-base min-h-[220px] font-mono leading-relaxed transition-all duration-200 ${
              error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : undefined}
            {...props}
          />

          {/* Drag and Drop premium blur overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-brand-500/10 backdrop-blur-md flex flex-col items-center justify-center border-2 border-dashed border-brand-500 rounded-xl pointer-events-none z-10 animate-fade-in">
              <Upload className="w-10 h-10 text-brand-400 mb-2 animate-bounce" />
              <span className="text-primary font-bold text-sm">Drop text or file here</span>
              <span className="text-secondary text-xs mt-1">Accepts raw text or text files (.txt, .md, .json, etc.)</span>
            </div>
          )}
        </div>

        {error && (
          <span id={`${textareaId}-error`} className="text-xs text-red-500 font-medium ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
