import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
    variant?: "default" | "exp" | "hp" | "mana" | "gold";
    showLabel?: boolean;
  }
>(({ className, value = 0, max = 100, variant = "default", showLabel, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barStyles: Record<string, string> = {
    default: "bg-gradient-to-r from-primary to-primary/80",
    exp: "bg-gradient-to-r from-emerald-400 to-cyan-400",
    hp: "bg-gradient-to-r from-red-500 to-rose-400",
    mana: "bg-gradient-to-r from-blue-500 to-indigo-400",
    gold: "bg-gradient-to-r from-amber-400 to-yellow-300",
  };

  const glowStyles: Record<string, string> = {
    default: "shadow-primary/30",
    exp: "shadow-emerald-400/30",
    hp: "shadow-red-500/30",
    mana: "shadow-blue-500/30",
    gold: "shadow-amber-400/30",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-secondary/80",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
          barStyles[variant],
          percentage > 0 && `shadow-md ${glowStyles[variant]}`
        )}
        style={{ width: `${percentage}%` }}
      />
      {/* Top glint */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-x-0 top-0 h-[40%] rounded-full bg-gradient-to-b from-white/25 to-transparent" />
      </div>
      {/* Shimmer */}
      {percentage > 10 && (
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      )}
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-sm">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
