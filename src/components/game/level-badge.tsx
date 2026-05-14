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
      className={`flex items-center justify-center rounded-full border-2 border-primary bg-primary/20 font-bold text-primary ${sizeMap[size]}`}
    >
      {level}
    </motion.div>
  );
}
