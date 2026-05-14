import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer rpg-press",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25 hover:brightness-110 rounded-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:shadow-destructive/25 rounded-lg",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 rounded-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold shadow-md hover:shadow-lg hover:shadow-amber-500/30 rounded-lg",
        game: "bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:brightness-110 rounded-lg",
        pixel:
          "pixel-border bg-primary text-primary-foreground font-pixel-accent uppercase text-xs tracking-wider",
        "pixel-gold":
          "pixel-border bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-pixel-accent uppercase text-xs tracking-wider",
        "pixel-danger":
          "pixel-border bg-gradient-to-r from-red-500 to-rose-400 text-white font-pixel-accent uppercase text-xs tracking-wider",
        "pixel-outline":
          "pixel-border bg-transparent text-foreground font-pixel-accent uppercase text-xs tracking-wider hover:bg-primary/10",
        battle:
          "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:brightness-110 rounded-lg animate-gradient",
        neon:
          "bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold hover:bg-neon-cyan/10 hover:shadow-lg hover:shadow-cyan-400/20 rounded-lg",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        xl: "h-13 px-10 text-base",
        icon: "h-10 w-10",
        pixel: "h-auto py-3 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
