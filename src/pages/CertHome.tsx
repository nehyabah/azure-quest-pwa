import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, BriefcaseBusiness, Gauge, GraduationCap, HelpCircle, ShieldCheck } from "lucide-react";
import { certFromSlug, metaFor, pathFor } from "../data/certPaths";
import { docs } from "../data/docs";
import { useAppStore } from "../store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { QuestionBankNotice } from "../components/QuestionBankNotice";

const actionCards = [
  { key: "knowledge", title: "Knowledge Check", description: "Quizzes, mock exams, case files, KQL Gym, and past attempts.", icon: HelpCircle },
  { key: "readiness", title: "Exam Readiness", description: "Readiness score, weak domains, trends, and next best action.", icon: Gauge },
  { key: "job", title: "Job Readiness", description: "Mock interviews, project stories, STAR answers, and what to say.", icon: BriefcaseBusiness }
];

export function CertHome() {
  const { cert: slug } = useParams();
  const cert = certFromSlug(slug);
  const meta = metaFor(cert);
  const readiness = Math.round(useAppStore((state) => state.progress.readiness[cert] ?? 0));
  const docInfo = docs[pathFor(cert) as keyof typeof docs];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <section className="aq-hero overflow-hidden p-5 sm:p-6">
        <Badge className="mb-3 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">{cert}</Badge>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{meta.title}</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold text-[var(--aq-muted)] sm:text-base">{meta.summary}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="aq-metric">
            <div className="text-3xl font-bold sm:text-4xl">{readiness}%</div>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">Readiness</p>
          </div>
          <div className="aq-metric">
            <div className="text-xl font-bold sm:text-2xl">10Q / 12m</div>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">Sprints</p>
          </div>
          <div className="aq-metric">
            <div className="text-xl font-bold sm:text-2xl">{meta.readinessTarget}%</div>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">Pass target</p>
          </div>
        </div>
      </section>

      <QuestionBankNotice />

      <section className="grid gap-4 sm:grid-cols-3">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.key} to={`/cert/${pathFor(cert)}/${card.key}`}>
              <Card className="aq-row-card group h-full">
                <CardHeader>
                  <div className="grid h-12 w-12 place-items-center rounded-md border border-[var(--aq-border)] bg-[var(--aq-blue-50)] text-[var(--aq-blue-700)]"><Icon className="h-6 w-6" /></div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-slate-500 dark:text-slate-400">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <Card>
        <CardHeader><CardTitle>Domain map</CardTitle><BookOpen className="h-6 w-6" /></CardHeader>
        <div className="grid gap-3">
          {docInfo.domains.map((domain) => (
            <div key={domain.name} className="aq-subtle-panel p-4">
              <div className="mb-2 flex justify-between gap-3 text-sm font-semibold"><span>{domain.name}</span><span>{domain.weight}</span></div>
              <Progress value={Number(domain.weight.match(/\d+/)?.[0] ?? 25)} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-[var(--aq-border)] bg-[var(--aq-blue-50)] text-[var(--aq-ink)] dark:bg-[#0b2545]">
        <CardHeader><CardTitle>Job-readiness promise</CardTitle><ShieldCheck className="h-6 w-6" /></CardHeader>
        <p className="text-lg font-medium opacity-90">This path does not only prepare you to pass. It prepares you to explain your projects, answer interviewer follow-ups, and sound like someone who has built real cloud security controls.</p>
        <Link className="mt-4 inline-flex items-center gap-2 rounded-md border border-[var(--aq-blue-700)] bg-[var(--aq-blue-700)] px-5 py-3 font-semibold text-white" to={`/cert/${pathFor(cert)}/job`}><GraduationCap className="h-5 w-5" /> Start Job Readiness</Link>
      </Card>
    </motion.div>
  );
}
