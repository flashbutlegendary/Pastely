import { Variants } from 'framer-motion';

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // Custom premium ease-out
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.25,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

// Staggered children container
export const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Individual staggered item
export const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Premium card hover effect
export const cardHoverVariants: Variants = {
  hover: {
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
};

// Light theme card hover effect
export const lightCardHoverVariants: Variants = {
  hover: {
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
};

// Micro-interaction button click
export const buttonTapVariants: Variants = {
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Modal animation
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 350,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Backdrop fade
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
