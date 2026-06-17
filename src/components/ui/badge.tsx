import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-white dark:bg-blue-300 dark:text-blue-950", className)} {...props} />;
}
