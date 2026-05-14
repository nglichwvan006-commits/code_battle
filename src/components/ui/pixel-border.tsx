import React from "react";
import { cn } from "@/lib/utils";

interface PixelBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "neon";
}

export function PixelBorder({ children, className, variant = "primary" }: PixelBorderProps) {
  const variantClasses = {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    accent: "text-primary",
    neon: "text-neon-purple",
  };

  return (
    <div className={cn("pixel-border", variantClasses[variant], className)}>
      {children}
    </div>
  );
}
