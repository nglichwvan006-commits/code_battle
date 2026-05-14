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
  color = "rgba(139, 92, 246, 0.3)",
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
          `0 0 10px ${color}`,
          `0 0 30px ${color}, 0 0 60px ${color}`,
          `0 0 10px ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
