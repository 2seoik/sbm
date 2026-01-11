"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 active:scale-[0.98]",
        outline:
          "border border-border bg-transparent hover:bg-secondary hover:border-primary/50 text-foreground active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-secondary hover:text-foreground active:scale-[0.95]",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] font-semibold",
        heroOutline:
          "border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 text-foreground backdrop-blur-sm active:scale-[0.98]",
        glass:
          "bg-card/60 backdrop-blur-xl border border-border/50 hover:bg-card/80 hover:border-primary/30 text-foreground active:scale-[0.98]",
        // Interactive action buttons
        action:
          "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20 active:scale-[0.92] transition-all duration-150",
        actionLike:
          "bg-transparent text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 active:scale-[0.92] data-[liked=true]:text-rose-500 data-[liked=true]:bg-rose-500/10 transition-all duration-150",
        actionFork:
          "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20 active:scale-[0.92] transition-all duration-150",
        actionReport:
          "bg-transparent text-muted-foreground hover:text-accent hover:bg-accent/10 active:bg-accent/20 active:scale-[0.92] transition-all duration-150",
        actionComment:
          "bg-transparent text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 active:bg-sky-500/20 active:scale-[0.92] transition-all duration-150",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        xs: "h-7 rounded-md px-2 text-xs",
        actionIcon: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
