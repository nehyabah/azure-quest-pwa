import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Clock, FileQuestion, FlaskConical, Play, RotateCcw } from "lucide-react";
import { certFromSlug, metaFor, pathFor } from "../data/certPaths";
import { examBlueprints } from "../data/examBlueprints";
import { quizBlueprints } from "../data/quizBlueprints";
import { useAppStore } from "../store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { QuestionBankNotice } from "../components/QuestionBankNotice";

export function KnowledgeCheck() {
  const { cert: slug } = useParams();
  const cert = certFromSlug(slug);
  const meta = metaFor(cert);
  const attempts = useAppStore((state) => state.attempts).filter((a) => a.cert === cert);
  const certQuizzes = quizBlueprints.filter((q) => q.cert === cert);
  const certExams = examBlueprints.filter((e) => e.cert === cert);
  const latest = attempts[0];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <section className="aq-hero overflow-hidden p-5 sm:p-7">
        <Badge className="mb-3 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">{cert} Exam Center</Badge>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Practice exams and quizzes.</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold text-[var(--aq-muted)]">Focused sprints and full mocks. Answers stay hidden until you finish, so timing stays realistic.</p>
      </section>

      <QuestionBankNotice />

      <div className="grid grid-cols-3 gap-3">
        <Card className="aq-metric flex flex-col items-center text-center">
          <Clock className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-bold leading-tight sm:text-lg">10Q / 12m</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">Quiz Sprints</p>
        </Card>
        <Card className="aq-metric flex flex-col items-center text-center">
          <FileQuestion className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-bold leading-tight sm:text-lg">50Q / 100m</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">Mock Exams</p>
        </Card>
        <Card className="aq-metric flex flex-col items-center text-center">
          <BarChart3 className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-bold leading-tight sm:text-lg">{latest ? `${latest.percentage}%` : "-"}</p>
          <p className="mt-1 w-full truncate text-xs font-bold uppercase tracking-[0.04em] text-[var(--aq-muted)]">{latest ? latest.title : "Latest"}</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quiz Sprints</CardTitle><BrainCircuit className="h-6 w-6" /></CardHeader>
        <div className="mb-3"><QuestionBankNotice compact /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {certQuizzes.map((quiz) => (
            <div key={quiz.id} className="aq-row-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="mb-2">{quiz.domain}</Badge>
                  <h3 className="text-base font-semibold">{quiz.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--aq-muted)]">{quiz.focusTags.join(" / ")}</p>
                </div>
                  <Button asChild size="sm" variant="hero" className="shrink-0"><Link to={`/arena?cert=${cert}&mode=quiz&count=10&minutes=12&quizId=${quiz.id}&domain=${encodeURIComponent(quiz.domain)}&tags=${encodeURIComponent(quiz.focusTags.join(","))}&examTitle=${encodeURIComponent(`${cert} ${quiz.title}`)}`}><Play className="h-4 w-4" /> Start</Link></Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Numbered Mock Exams</CardTitle><FileQuestion className="h-6 w-6" /></CardHeader>
        <div className="mb-3"><QuestionBankNotice compact /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {certExams.map((exam) => {
            const best = attempts.filter((a) => a.blueprintId === exam.id).sort((a, b) => b.percentage - a.percentage)[0];
            return (
              <div key={exam.id} className="aq-row-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-2 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">{exam.title}</Badge>
                    <h3 className="text-base font-semibold">Weighted structure changes every launch</h3>
                    <p className="mt-1 text-sm font-semibold text-[var(--aq-muted)]">50 questions / 100 minutes / unanswered grade wrong</p>
                  </div>
                  <Button asChild size="sm" variant="hero" className="shrink-0"><Link to={`/arena?cert=${cert}&mode=timed&count=50&minutes=100&examId=${exam.id}&examTitle=${encodeURIComponent(exam.title)}`}><Play className="h-4 w-4" /> Start</Link></Button>
                </div>
                <div className="mt-3"><Progress value={best?.percentage ?? 0} /><p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Best: {best ? `${best.percentage}%` : "Not attempted"}</p></div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button asChild size="lg" variant="soft"><Link to={`/cases?cert=${cert}`}><FlaskConical /> Case Files</Link></Button>
        <Button asChild size="lg" variant="soft"><Link to={`/kql?cert=${cert}`}>KQL Gym</Link></Button>
        <Button asChild size="lg" variant="soft"><Link to={`/history?cert=${cert}`}><RotateCcw /> Past Attempts</Link></Button>
      </div>
    </motion.div>
  );
}
