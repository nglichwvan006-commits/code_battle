"use client";

import { motion } from "framer-motion";
import { calculateLevel } from "@/utils/exp";

interface LevelBadgeProps {
  exp: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

export function LevelBadge({ exp, size = "md" }: LevelBadgeProps) {
  const { level } = calculateLevel(exp);

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary shadow-sm ${sizeMap[size]}`}
    >
      {level}
    </motion.div>
  );
}
