import React from 'react';
import { motion } from 'framer-motion';
import { cardHoverVariants, lightCardHoverVariants } from '../animations/variants';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'surface';
  isHoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  isHoverable = false,
  onClick,
}) => {
  const { theme } = useTheme();

  const baseStyles = 'rounded-2xl border border-surface border-opacity-70 p-6 md:p-8 relative overflow-hidden transition-colors duration-200';
  const variants = {
    glass: 'glass-card noise-overlay',
    surface: 'surface-card',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (isHoverable) {
    const hoverVariants = theme === 'dark' ? cardHoverVariants : lightCardHoverVariants;
    return (
      <motion.div
        className={combinedStyles}
        variants={hoverVariants}
        whileHover="hover"
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedStyles} onClick={onClick}>
      {children}
    </div>
  );
};
