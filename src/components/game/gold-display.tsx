"use client";

import { motion } from "framer-motion";

interface GoldDisplayProps {
  amount: number;
}

export function GoldDisplay({ amount }: GoldDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-2xl">💰</span>
      <span className="text-xl font-bold text-gradient-gold">
        {amount.toLocaleString()}
      </span>
    </motion.div>
  );
}
