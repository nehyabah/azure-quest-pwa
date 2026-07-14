import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>>(
  ({ className, value = 0, ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full border border-[var(--aq-border)] bg-[var(--aq-blue-50)] dark:bg-[#061227] sm:h-2.5", className)} {...props}>
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-[var(--aq-blue-600)] transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = "Progress";
