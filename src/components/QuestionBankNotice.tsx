import { ShieldAlert } from "lucide-react";
import { Card } from "./ui/card";

export const DEMO_BANK_COPY =
  "Demo practice bank: These questions are seed content for testing the platform. They are not official Microsoft questions and are not yet source-grounded or fully reviewed.";

export const MICROSOFT_DISCLAIMER = "Not affiliated with or endorsed by Microsoft.";

export function QuestionBankNotice({ compact = false }: { compact?: boolean }) {
  return (
    <Card className={compact ? "border-l-4 border-[#9cc9f5] border-l-amber-400 bg-white p-3 text-slate-950 dark:border-[#24486f] dark:border-l-amber-300 dark:bg-[#081d38] dark:text-[#e7f3ff]" : "border-l-4 border-[#9cc9f5] border-l-amber-400 bg-white p-4 text-slate-950 dark:border-[#24486f] dark:border-l-amber-300 dark:bg-[#081d38] dark:text-[#e7f3ff]"}>
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
        <div className="space-y-1">
          <p className={compact ? "text-sm font-semibold leading-snug" : "font-semibold leading-snug"}>{DEMO_BANK_COPY}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0057b8] dark:text-[#8cc8ff]">{MICROSOFT_DISCLAIMER}</p>
        </div>
      </div>
    </Card>
  );
}
