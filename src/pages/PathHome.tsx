import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, GraduationCap, ShieldCheck, WifiOff } from "lucide-react";
import { certPaths, pathFor } from "../data/certPaths";
import { useAppStore } from "../store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export function PathHome() {
  const readiness = useAppStore((state) => state.progress.readiness);
  const settings = useAppStore((state) => state.settings);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-blue-100 bg-white p-5 text-blue-950 shadow-card dark:border-blue-900/60 dark:bg-slate-950 dark:text-white sm:p-8">
        <div className="grid gap-5 md:grid-cols-[1.25fr_.75fr] md:items-end">
          <div>
            <Badge className="mb-3 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500">Azure Quest</Badge>
            <h1 className="max-w-3xl text-2xl font-semibold leading-tight sm:text-5xl">Choose your certification path.</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium text-blue-900/70 dark:text-blue-50/75 sm:text-base">Focused practice exams, readiness analytics, project storytelling, and interview simulation for Microsoft security roles.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/40 md:grid-cols-1 md:gap-3">
            <div className="flex items-center gap-2"><Gauge className="h-5 w-5 shrink-0" /><span className="text-sm font-semibold">Readiness replaces XP</span></div>
            <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 shrink-0" /><span className="text-sm font-semibold">Practice-first build</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 shrink-0" /><span className="text-sm font-semibold">Job interview simulator</span></div>
            {settings.lowBandwidth ? <div className="flex items-center gap-2"><WifiOff className="h-5 w-5 shrink-0" /><span className="text-sm font-semibold">Low-bandwidth mode on</span></div> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {certPaths.map((path, index) => {
          const value = Math.round(readiness[path.cert] ?? 0);
          return (
            <motion.div key={path.cert} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={`/cert/${pathFor(path.cert)}`}>
                <Card className="overflow-hidden p-5 transition hover:border-blue-300 hover:shadow-card dark:hover:border-blue-700 sm:p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge className="bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500">{path.cert}</Badge>
                        <Badge className="bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">{path.role}</Badge>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">{path.title}</CardTitle>
                      <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">{path.summary}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/40 sm:min-w-32 sm:flex-col sm:text-center">
                      <div className="text-3xl font-semibold">{value}%</div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">READINESS</p>
                    </div>
                  </div>
                  <Progress value={value} />
                  <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{path.examFormat}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">Open path <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </section>
    </motion.div>
  );
}
