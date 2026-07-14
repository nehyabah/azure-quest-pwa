import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock, Flag, RotateCcw, ShieldCheck } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import type { Cert, ExamMode, Question, QuizOption } from "../types";
import { buildExam, scoreAttempt } from "../utils/quizEngine";
import { formatSeconds } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { examBlueprints, domainWeights } from "../data/examBlueprints";
import { MICROSOFT_DISCLAIMER, QuestionBankNotice } from "../components/QuestionBankNotice";

function validCert(value: string | null): Cert {
  if (value === "AZ-500" || value === "SC-500" || value === "SC-300") return value;
  return "SC-300";
}

function validMode(value: string | null): ExamMode {
  return value === "quiz" || value === "endless" || value === "weak" || value === "daily" || value === "case" || value === "kql" ? value : "timed";
}

function optionTone(optionId: QuizOption["id"], selected: QuizOption["id"] | null) {
  if (optionId === selected) return "border-blue-600 bg-blue-700 text-white ring-2 ring-blue-200 dark:border-blue-400 dark:bg-blue-500 dark:ring-blue-800";
  return "border-slate-200 bg-white text-blue-950 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-slate-950 dark:text-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-950";
}

export function PracticeArena() {
  const [params] = useSearchParams();
  const questions = useAppStore((state) => state.questions);
  const recordAttempt = useAppStore((state) => state.recordAttempt);
  const userProgress = useAppStore((state) => state.progress);
  const settings = useAppStore((state) => state.settings);

  const cert = validCert(params.get("cert"));
  const mode = validMode(params.get("mode"));
  const count = Number(params.get("count") ?? (mode === "daily" || mode === "quiz" ? 10 : mode === "case" ? 8 : mode === "kql" ? 8 : mode === "weak" ? 15 : 50));
  const minutes = Number(params.get("minutes") ?? (mode === "quiz" ? 12 : mode === "daily" ? 10 : mode === "case" ? 20 : mode === "kql" ? 15 : mode === "weak" ? 15 : 100));
  const timeLimitSeconds = minutes * 60;
  const weakTags = Object.entries(userProgress.weakTags).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tag]) => tag);
  const seedParam = params.get("seed") ?? undefined;
  const examTitle = params.get("examTitle") ?? `${cert} ${mode === "quiz" ? "Quiz Sprint" : mode === "daily" ? "Daily Drill" : mode === "case" ? "Case File" : "Mock Exam"}`;
  const blueprintId = params.get("examId") ?? undefined;
  const quizId = params.get("quizId") ?? undefined;
  const focusDomain = params.get("domain") ?? undefined;
  const tagsParam = params.get("tags");
  const focusTags = useMemo(() => tagsParam?.split(",").filter(Boolean) ?? [], [tagsParam]);
  const fighter = params.get("fighter");
  const blueprint = blueprintId ? examBlueprints.find((item) => item.id === blueprintId) : undefined;
  const weights = blueprint?.domainWeights ?? (!focusDomain && mode === "timed" ? domainWeights[cert] : undefined);

  const exam = useMemo(
    () => buildExam({ bank: questions, cert, mode, count, weakTags, seed: seedParam, focusDomain, focusTags, domainWeights: weights }),
    // Fresh randomized structure each launch unless a retake seed is supplied.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cert, mode, count, seedParam, focusDomain, params.toString()]
  );

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [grading, setGrading] = useState(false);
  const [gradeProgress, setGradeProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<QuizOption["id"] | null>(null);
  const [selections, setSelections] = useState<Record<string, QuizOption["id"] | null>>({});
  const [secondsByQuestion, setSecondsByQuestion] = useState<Record<string, number>>({});
  const [startedAt] = useState(() => new Date().toISOString());
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const duration = 1800;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;
    const timer = window.setInterval(() => {
      step++;
      setLoadProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        window.clearInterval(timer);
        setLoading(false);
      }
    }, interval);
    return () => window.clearInterval(timer);
  }, []);
  const qStart = useRef(Date.now());
  const question = exam.questions[index];

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    if (!finished && elapsed >= timeLimitSeconds) setFinished(true);
  }, [elapsed, finished, timeLimitSeconds]);

  useEffect(() => {
    qStart.current = Date.now();
    const q = exam.questions[index];
    setSelected(q ? (selections[q.id] ?? null) : null);
  }, [exam.questions, index, selections]);

  const attempted = Object.keys(selections).length;
  const progressPercent = ((index + 1) / exam.questions.length) * 100;
  const timeLeft = Math.max(0, timeLimitSeconds - elapsed);

  function choose(optionId: QuizOption["id"]) {
    if (!question) return;
    const seconds = Math.max(1, Math.round((Date.now() - qStart.current) / 1000));
    setSelected(optionId);
    setSelections((prev) => ({ ...prev, [question.id]: optionId }));
    setSecondsByQuestion((prev) => ({ ...prev, [question.id]: seconds }));
  }

  function prev() {
    if (index === 0) return;
    setIndex((v) => v - 1);
  }

  function next() {
    if (!selected || !question) return;
    if (index + 1 >= exam.questions.length) setFinished(true);
    else setIndex((v) => v + 1);
  }

  const finalAttempt = useMemo(() => scoreAttempt({
    cert,
    mode,
    kind: mode === "quiz" ? "quiz" : mode === "daily" ? "daily" : mode === "case" ? "case" : mode === "kql" ? "kql" : mode === "timed" ? "exam" : "practice",
    title: examTitle,
    blueprintId,
    quizId,
    focusDomain,
    focusTags,
    startedAt,
    seed: exam.seed,
    questions: exam.questions,
    selections,
    secondsByQuestion,
    timeLimitSeconds
  }), [blueprintId, cert, exam.questions, exam.seed, examTitle, focusDomain, focusTags, mode, quizId, secondsByQuestion, selections, startedAt, timeLimitSeconds]);

  function arenaUrl(seed?: string) {
    const next = new URLSearchParams({
      cert,
      mode,
      count: String(count),
      minutes: String(minutes),
      examTitle
    });
    if (seed) next.set("seed", seed);
    if (focusDomain) next.set("domain", focusDomain);
    if (focusTags.length) next.set("tags", focusTags.join(","));
    if (blueprintId) next.set("examId", blueprintId);
    if (quizId) next.set("quizId", quizId);
    return `/arena?${next.toString()}`;
  }

  const runGradingAnimation = useCallback(() => {
      setGrading(true);
      setGradeProgress(0);
      const duration = 1800;
      const interval = 30;
      const steps = duration / interval;
      let step = 0;
      const timer = window.setInterval(() => {
        step++;
        setGradeProgress(Math.min(100, Math.round((step / steps) * 100)));
        if (step >= steps) {
          window.clearInterval(timer);
          if (finalAttempt.percentage >= 70 && !settings.reduceAnimations && !settings.lowBandwidth) void confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 } });
          setGrading(false);
        }
      }, interval);
      return timer;
  }, [finalAttempt.percentage, settings.lowBandwidth, settings.reduceAnimations]);

  useEffect(() => {
    if (!finished || saved || savingAttempt || saveError) return;
    let gradingTimer: number | undefined;
    let cancelled = false;

    async function saveAttempt() {
      setSavingAttempt(true);
      try {
        await recordAttempt(finalAttempt);
        if (cancelled) return;
        setSaved(true);
        gradingTimer = runGradingAnimation();
      } catch (error) {
        if (cancelled) return;
        setSaveError(error instanceof Error ? error.message : "Unable to save this attempt locally.");
        setGrading(false);
      } finally {
        if (!cancelled) setSavingAttempt(false);
      }
    }

    void saveAttempt();
    return () => {
      cancelled = true;
      if (gradingTimer) window.clearInterval(gradingTimer);
    };
  }, [finalAttempt, finished, recordAttempt, runGradingAnimation, saveError, saved, savingAttempt]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm space-y-6 px-8 text-center"
        >
          <div className="space-y-1">
            <Badge className="mb-4 border-blue-500/40 bg-blue-500/20 text-blue-100">{cert}</Badge>
            <h2 className="text-2xl font-semibold text-white">{examTitle}</h2>
            <p className="text-sm text-slate-400">{count} questions · {minutes} min</p>
            <p className="mx-auto max-w-xs pt-3 text-xs font-semibold text-emerald-200">{MICROSOFT_DISCLAIMER}</p>
          </div>

          <div className="space-y-3">
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ ease: "linear", duration: 0.03 }}
              />
            </div>
            <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
              {loadProgress < 40 ? "Selecting questions" : loadProgress < 75 ? "Weighting domains" : loadProgress < 95 ? "Preparing your exam" : "Ready"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!exam.questions.length) {
    return <Card><CardTitle>No questions found for this run.</CardTitle><p className="mt-2 font-medium text-slate-500">Try a mixed exam or another quiz.</p></Card>;
  }

  if (finished && grading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm space-y-6 px-8 text-center"
        >
          <div className="space-y-1">
            <Badge className="mb-4 border-blue-500/40 bg-blue-500/20 text-blue-100">{cert}</Badge>
            <h2 className="text-2xl font-semibold text-white">{examTitle}</h2>
            <p className="text-sm text-slate-400">{Object.keys(selections).length} of {exam.questions.length} answered</p>
          </div>

          <div className="space-y-3">
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                initial={{ width: "0%" }}
                animate={{ width: `${gradeProgress}%` }}
                transition={{ ease: "linear", duration: 0.03 }}
              />
            </div>
            <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
              {gradeProgress < 35 ? "Scoring your answers" : gradeProgress < 65 ? "Analysing domains" : gradeProgress < 90 ? "Calculating readiness" : "Almost done"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Card className={finalAttempt.passed ? "border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-950" : "border-slate-900 bg-slate-950 text-white"}>
          <CardHeader>
            <div>
              <Badge className="border-white/20 bg-white/15 text-white">{finalAttempt.kind.toUpperCase()} COMPLETE</Badge>
              <CardTitle className="mt-3 text-3xl">{examTitle}</CardTitle>
              <p className="font-medium opacity-80">{formatSeconds(finalAttempt.timeTakenSeconds)} used · {formatSeconds(timeLimitSeconds)} limit</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold">{finalAttempt.percentage}%</div>
              <p className="text-sm font-semibold">{finalAttempt.passed ? "Passed" : "Needs review"}</p>
            </div>
          </CardHeader>
          <Progress value={finalAttempt.percentage} className="bg-white/30" />
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-white/20 bg-white/15 p-3"><p className="text-xl font-semibold">{finalAttempt.score}</p><p className="text-xs font-semibold">Correct</p></div>
            <div className="rounded-lg border border-white/20 bg-white/15 p-3"><p className="text-xl font-semibold">{finalAttempt.total}</p><p className="text-xs font-semibold">Total</p></div>
            <div className="rounded-lg border border-white/20 bg-white/15 p-3"><p className="text-xl font-semibold">+{finalAttempt.readinessDelta ?? 0}</p><p className="text-xs font-semibold">Readiness</p></div>
          </div>
        </Card>

        {saveError ? (
          <Card className="border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-50">
            <CardHeader>
              <CardTitle>Attempt not saved yet</CardTitle>
            </CardHeader>
            <p className="text-sm font-medium">Your score is shown below, but local progress and history were not updated. {saveError}</p>
            <Button onClick={() => setSaveError(null)} className="mt-4" variant="soft">Retry save</Button>
          </Card>
        ) : null}

        <Card>
          <CardHeader><CardTitle>Domain report</CardTitle><ShieldCheck className="h-6 w-6 text-blue-500" /></CardHeader>
          <div className="grid gap-3">
            {Object.entries(finalAttempt.domains).map(([domain, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100);
              return <div key={domain} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><div className="mb-2 flex justify-between gap-3 text-sm font-semibold"><span>{domain}</span><span>{stats.correct}/{stats.total} · {pct}%</span></div><Progress value={pct} /></div>;
            })}
          </div>
        </Card>


        <Card>
          <CardHeader><CardTitle>Answer review</CardTitle><CheckCircle2 className="h-6 w-6 text-sky-500" /></CardHeader>
          <div className="mb-3"><QuestionBankNotice compact /></div>
          <div className="space-y-3">
            {exam.questions.map((q, i) => {
              const chosen = selections[q.id];
              const chosenText = q.options.find((o) => o.id === chosen)?.text ?? "Unanswered";
              const correctText = q.options.find((o) => o.id === q.answer)?.text ?? q.answer;
              const ok = chosen === q.answer;
              return (
                <details key={q.id} className="rounded-xl bg-slate-100 p-4 dark:bg-white/10">
                  <summary className="cursor-pointer text-sm font-semibold">{i + 1}. {ok ? "Correct" : "Missed"} · {q.domain}</summary>
                  <p className="mt-3 font-semibold">{q.stem}</p>
                  <div className="mt-3 grid gap-2 text-sm font-medium">
                    <p className={ok ? "text-blue-600 dark:text-blue-300" : "text-rose-600 dark:text-rose-300"}>Your answer: {chosen ? `${chosen}. ${chosenText}` : "Unanswered"}</p>
                    <p className="text-blue-700 dark:text-blue-300">Correct answer: {q.answer}. {correctText}</p>
                    <p className="text-slate-600 dark:text-slate-300">{q.explanation}</p>
                    {!ok && chosen && q.whyWrong[chosen] ? <p className="rounded-xl bg-white p-3 dark:bg-black/20">Why your answer missed: {q.whyWrong[chosen]}</p> : null}
                  </div>
                </details>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild size="lg" variant="hero"><Link to={arenaUrl()}><RotateCcw /> New randomized structure</Link></Button>
          <Button asChild size="lg" variant="soft"><Link to={arenaUrl(exam.seed)}>Retake same questions</Link></Button>
          <Button asChild size="lg" variant="default"><Link to="/history">Past Exams & Quizzes</Link></Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
      <QuestionBankNotice compact />

      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm"><Link to={`/cert/${cert.toLowerCase()}/knowledge`}><ArrowLeft className="h-4 w-4" /> Knowledge</Link></Button>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <Badge className="max-w-[140px] truncate sm:max-w-none">{examTitle}</Badge>
          {fighter ? <Badge className="hidden border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 sm:inline-flex">{fighter}</Badge> : null}
          <Badge className={`shrink-0 ${timeLeft < 60 ? "border-rose-500 bg-rose-500 text-white" : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100"}`}><Clock className="h-3 w-3" /> {formatSeconds(timeLeft)}</Badge>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <Badge className="mb-2 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500">{question.scenarioOrg}</Badge>
            <CardTitle className="text-xl">Question {index + 1}/{exam.questions.length}</CardTitle>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{question.domain}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">{attempted}/{exam.questions.length}</div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">answered</p>
          </div>
        </CardHeader>
        <Progress value={progressPercent} />
      </Card>

      <motion.div key={question.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <Card className="border-blue-100 dark:border-blue-900/60">
          <CardContent>
            <p className="text-xl font-semibold leading-tight">{question.stem}</p>
            {question.diagram ? <pre className="rounded-lg bg-slate-950 p-4 text-sm font-medium text-sky-200 dark:bg-black/40">{question.diagram}</pre> : null}
            <div className="mt-4 rounded-lg border border-dashed border-blue-200 bg-blue-50 p-3 dark:border-blue-900/70 dark:bg-blue-950/30">
              <button
                type="button"
                onClick={() => setFlaggedQuestionIds((prev) => ({ ...prev, [question.id]: !prev[question.id] }))}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <Flag className="h-4 w-4" />
                {flaggedQuestionIds[question.id] ? "Flagged for review" : "Flag/report question"}
              </button>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Placeholder only: persisted question reports arrive with the future review workflow.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {question.options.map((option) => (
            <motion.button whileTap={{ scale: 0.99 }} key={option.id} onClick={() => choose(option.id)} className={`flex min-h-16 items-center gap-3 rounded-lg border p-4 text-left text-base font-semibold shadow-sm transition ${optionTone(option.id, selected)}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-black/10 text-sm dark:bg-white/10">{option.id}</span>
              <span className="flex-1">{option.text}</span>
              {selected === option.id ? <CheckCircle2 className="h-5 w-5" /> : null}
            </motion.button>
          ))}
        </div>

        <div className="sticky bottom-24 z-20 sm:static">
          <div className="grid grid-cols-[auto_1fr_auto] gap-2">
            <Button onClick={prev} disabled={index === 0} size="lg" variant="soft" className="h-12 px-4"><ArrowLeft className="h-4 w-4" /></Button>
            <Button onClick={next} disabled={!selected} size="lg" variant="hero" className="h-12 text-sm">{index + 1 >= exam.questions.length ? "Finish run" : "Next question"}</Button>
            <Button onClick={() => setFinished(true)} size="lg" variant="soft" className="h-12 text-sm"><span className="hidden sm:inline">Finish Now</span><span className="sm:hidden">Finish</span></Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
