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
    exp: "bg-exp",
    hp: "bg-hp",
    mana: "bg-mana",
    gold: "bg-gold",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full bg-black/40 pixel-border-sm",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          variantClasses[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
      {/* Glint effect (pixel style) */}
      <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
