import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md border border-[var(--aq-border)] bg-[var(--aq-blue-50)] px-2.5 py-1 text-xs font-semibold text-[var(--aq-blue-800)] dark:text-[var(--aq-ink)]", className)} {...props} />;
}
