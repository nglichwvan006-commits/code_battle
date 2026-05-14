import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-[10px] font-pixel-ui uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary/20 text-primary",
        secondary: "border-secondary bg-secondary/20 text-secondary-foreground",
        destructive: "border-destructive bg-destructive/20 text-destructive",
        outline: "text-foreground border-foreground/30",
        easy: "border-difficulty-easy bg-difficulty-easy/10 text-difficulty-easy",
        medium: "border-difficulty-medium bg-difficulty-medium/10 text-difficulty-medium",
        hard: "border-difficulty-hard bg-difficulty-hard/10 text-difficulty-hard",
        common: "border-rarity-common bg-rarity-common/10 text-rarity-common",
        uncommon: "border-rarity-uncommon bg-rarity-uncommon/10 text-rarity-uncommon",
        rare: "border-rarity-rare bg-rarity-rare/10 text-rarity-rare",
        epic: "border-rarity-epic bg-rarity-epic/10 text-rarity-epic",
        legendary: "border-rarity-legendary bg-rarity-legendary/10 text-rarity-legendary animate-pulse",
        pixel: "pixel-border bg-primary/10 text-primary border-none",
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
