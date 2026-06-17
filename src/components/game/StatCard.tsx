import { motion } from "framer-motion";
import { Card } from "../ui/card";

export function StatCard({ emoji, label, value, hint }: { emoji: string; label: string; value: string | number; hint?: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
      <Card className="overflow-hidden p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-200 to-violet-200 text-xs font-black dark:from-sky-500/30 dark:to-violet-500/30 sm:h-12 sm:w-12 sm:text-sm">
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
            <p className="truncate text-sm font-black">{value}</p>
          </div>
        </div>
        {hint ? <p className="mt-2 truncate text-xs font-bold text-slate-500 dark:text-slate-400 sm:mt-3 sm:text-sm">{hint}</p> : null}
      </Card>
    </motion.div>
  );
}
