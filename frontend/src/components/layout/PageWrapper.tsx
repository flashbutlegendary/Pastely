import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  animate = true,
}) => {
  const containerClass = `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex-1 flex flex-col justify-center relative z-10 ${className}`;

  if (!animate) {
    return <div className={containerClass}>{children}</div>;
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={containerClass}
    >
      {children}
    </motion.main>
  );
};
