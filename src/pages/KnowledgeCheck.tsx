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
      <section className="rounded-lg border border-blue-100 bg-white p-5 text-blue-950 shadow-card dark:border-blue-900/60 dark:bg-slate-950 dark:text-white sm:p-6">
        <Badge className="mb-3 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500">{cert} Exam Center</Badge>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Practice exams and quizzes.</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium text-blue-900/70 dark:text-blue-50/75">Focused sprints and full mocks. Answers stay hidden until you finish, so timing stays realistic.</p>
      </section>

      <QuestionBankNotice />

      <div className="grid grid-cols-3 gap-3">
        <Card className="flex flex-col items-center p-4 text-center sm:p-6">
          <Clock className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-semibold leading-tight sm:text-lg">10Q · 12m</p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Quiz Sprints</p>
        </Card>
        <Card className="flex flex-col items-center p-4 text-center sm:p-6">
          <FileQuestion className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-semibold leading-tight sm:text-lg">50Q · 100m</p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Mock Exams</p>
        </Card>
        <Card className="flex flex-col items-center p-4 text-center sm:p-6">
          <BarChart3 className="mb-2 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-base font-semibold leading-tight sm:text-lg">{latest ? `${latest.percentage}%` : "—"}</p>
          <p className="mt-1 w-full truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{latest ? latest.title : "Latest"}</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quiz Sprints</CardTitle><BrainCircuit className="h-6 w-6" /></CardHeader>
        <div className="mb-3"><QuestionBankNotice compact /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {certQuizzes.map((quiz) => (
            <div key={quiz.id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 dark:border-blue-900/60 dark:bg-slate-900 dark:hover:border-blue-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="mb-2">{quiz.domain}</Badge>
                  <h3 className="text-base font-semibold">{quiz.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{quiz.focusTags.join(" · ")}</p>
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
              <div key={exam.id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 dark:border-blue-900/60 dark:bg-slate-900 dark:hover:border-blue-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-2 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500">{exam.title}</Badge>
                    <h3 className="text-base font-semibold">Weighted structure changes every launch</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">50 questions · 100 minutes · unanswered grade wrong</p>
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
