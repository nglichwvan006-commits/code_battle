"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { calculateLevel } from "@/utils/exp";

interface ExpBarProps {
  exp: number;
  className?: string;
  showLabel?: boolean;
}

export function ExpBar({ exp, className, showLabel = true }: ExpBarProps) {
  const levelInfo = calculateLevel(exp);

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gradient-green">
            Level {levelInfo.level}
          </span>
          <span className="text-muted-foreground">
            {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
          </span>
        </div>
      )}
      <Progress
        value={levelInfo.currentExp}
        max={levelInfo.requiredExp}
        variant="exp"
        className="h-3"
      />
    </div>
  );
}
