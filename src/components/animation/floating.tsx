"use client";

import { motion } from "framer-motion";

interface FloatingProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function Floating({
  children,
  duration = 3,
  distance = 10,
  className,
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [-distance, distance, -distance] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function GlowPulse({
  children,
  className,
  color = "rgba(167, 139, 250, 0.25)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 8px ${color}`,
          `0 0 24px ${color}, 0 0 48px ${color}`,
          `0 0 8px ${color}`,
        ],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

export function BounceIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        bounce: 0.4,
      }}
    >
      {children}
    </motion.div>
  );
}
