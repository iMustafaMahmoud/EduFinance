"use client";

import { motion } from "framer-motion";

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Slide in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.4 },
};

// Slide in from right
export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.4 },
};

// Scale animation
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 },
};

// Stagger container for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger item
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Hover scale effect
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 },
};

// Button press effect
export const buttonPress = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

// Animated page wrapper
export function AnimatedPage({ children }: { children: React.ReactNode }) {
  return <motion.div {...fadeIn}>{children}</motion.div>;
}

// Animated card
export function AnimatedCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated list container
export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}

// Animated list item
export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return <motion.div variants={staggerItem}>{children}</motion.div>;
}

// Animated button
export function AnimatedButton({
  children,
  className = "",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      {...buttonPress}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
