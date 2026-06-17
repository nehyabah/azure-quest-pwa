import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  {
    variants: {
      variant: {
        default: "bg-blue-900 text-white shadow-sm hover:bg-blue-800 dark:bg-blue-500 dark:text-blue-950 dark:hover:bg-blue-400",
        hero: "bg-blue-800 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300",
        success: "bg-blue-600 text-white hover:bg-blue-700",
        danger: "bg-rose-500 text-white hover:bg-rose-600",
        ghost: "bg-transparent hover:bg-blue-50 dark:hover:bg-blue-400/10",
        soft: "border border-blue-200 bg-blue-50 text-blue-800 shadow-sm hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-5 text-sm",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
