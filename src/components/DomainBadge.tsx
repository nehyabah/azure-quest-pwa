import { Badge } from "./ui/badge";

export function DomainBadge({ label, tone = "slate" }: { label: string; tone?: "slate" | "blue" | "violet" | "blue" }) {
  const tones = {
    slate: "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-white",
    blue: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100",
    violet: "bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-100",
    blue: "bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100"
  };
  return <Badge className={tones[tone]}>{label}</Badge>;
}
