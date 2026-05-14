import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
    variant?: "default" | "exp" | "hp" | "mana" | "gold";
  }
>(({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantClasses = {
    default: "bg-primary",
    exp: "bg-gradient-to-r from-emerald-500 to-green-400",
    hp: "bg-gradient-to-r from-red-500 to-rose-400",
    mana: "bg-gradient-to-r from-blue-500 to-indigo-400",
    gold: "bg-gradient-to-r from-amber-500 to-yellow-400",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          variantClasses[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
