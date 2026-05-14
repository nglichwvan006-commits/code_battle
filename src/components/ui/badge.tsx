import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "rounded-full border-primary/30 bg-primary/15 text-primary",
        secondary: "rounded-full border-secondary bg-secondary text-secondary-foreground",
        destructive: "rounded-full border-destructive/30 bg-destructive/15 text-destructive",
        outline: "rounded-full text-foreground border-border",
        easy: "rounded-full border-difficulty-easy/30 bg-difficulty-easy/10 text-difficulty-easy",
        medium: "rounded-full border-difficulty-medium/30 bg-difficulty-medium/10 text-difficulty-medium",
        hard: "rounded-full border-difficulty-hard/30 bg-difficulty-hard/10 text-difficulty-hard",
        common: "rounded-full border-rarity-common/30 bg-rarity-common/10 text-rarity-common",
        uncommon: "rounded-full border-rarity-uncommon/30 bg-rarity-uncommon/10 text-rarity-uncommon",
        rare: "rounded-full border-rarity-rare/30 bg-rarity-rare/10 text-rarity-rare",
        epic: "rounded-full border-rarity-epic/30 bg-rarity-epic/10 text-rarity-epic",
        legendary: "rounded-full border-rarity-legendary/30 bg-rarity-legendary/10 text-rarity-legendary animate-pulse-glow",
        pixel: "pixel-border-sm bg-primary/10 text-primary font-pixel-accent text-[10px] uppercase tracking-wider rounded-none",
        neon: "rounded-full border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
