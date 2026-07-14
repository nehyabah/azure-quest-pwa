import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock, ExternalLink, FileText, Mic, Network, PauseCircle, Play, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { certFromSlug, metaFor, pathFor } from "../data/certPaths";
import { interviewQuestions, interviewSessions, jobTracks, projectStories, type InterviewQuestion, type JobTrack } from "../data/jobReadiness";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

function trackForCert(cert: string): JobTrack[] {
  if (cert === "SC-300") return ["IAM", "Cloud Security"];
  if (cert === "AZ-500") return ["Cloud Security", "SOC", "Cloud SOC", "IAM"];
  return ["Cloud Security", "Cloud SOC", "AI Security", "IAM"];
}

function phaseLabel(q?: InterviewQuestion) {
  if (!q) return "Interview";
  return q.phase.replace("-", " ");
}

export function JobReadiness() {
  const { cert: slug } = useParams();
  const cert = certFromSlug(slug);
  const meta = metaFor(cert);
  const tracks = trackForCert(cert);
  const [track, setTrack] = useState<JobTrack>(tracks[0]);
  const availableSessions = interviewSessions.filter((s) => s.certs.includes(cert) && tracks.includes(s.track));
  const [sessionId, setSessionId] = useState(availableSessions[0]?.id ?? "");
  const session = availableSessions.find((s) => s.id === sessionId) ?? availableSessions[0];
  const sessionQuestions = useMemo(() => (session?.questionIds ?? []).map((id) => interviewQuestions.find((q) => q.id === id)).filter(Boolean) as InterviewQuestion[], [session]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [coachOpen, setCoachOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const activeQuestion = sessionQuestions[index] ?? sessionQuestions[0];
  const progress = sessionQuestions.length ? ((index + 1) / sessionQuestions.length) * 100 : 0;

  const [selectedProjects, setSelectedProjects] = useState<string[]>(["gatekeeper", "citadel"]);
  const [mapperTrack, setMapperTrack] = useState<JobTrack>(tracks[0]);
  const mappedProjects = projectStories.filter((p) => selectedProjects.includes(p.id));
  const mapperQuestions = interviewQuestions.filter((q) => q.certs.includes(cert) && (q.track === mapperTrack || q.bestProjects.some((id) => selectedProjects.includes(id)))).slice(0, 8);
  const trackSummary = tracks.join(", ").replace(/, ([^,]*)$/, " and $1");

  function startSession(id = sessionId) {
    setSessionId(id);
    setStarted(true);
    setIndex(0);
    setCoachOpen(false);
    setChecked({});
  }

  function nextQuestion() {
    setCoachOpen(false);
    if (index + 1 >= sessionQuestions.length) setStarted(false);
    else setIndex((v) => v + 1);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <section className="aq-hero overflow-hidden p-5 sm:p-6">
        <Badge className="mb-3 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">{cert} Job Readiness</Badge>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">Interview simulator + project storytelling engine.</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold text-[var(--aq-muted)] sm:text-base">Practice a focused {cert} interview across {trackSummary}. Then map your projects to stronger answers, STAR stories, architecture talk-throughs, and follow-up risks.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="aq-metric"><Mic className="mb-2 h-5 w-5 text-[var(--aq-blue-600)]" /><p className="text-sm font-bold">30-min simulator</p></div>
          <div className="aq-metric"><Network className="mb-2 h-5 w-5 text-[var(--aq-blue-600)]" /><p className="text-sm font-bold">Project mapper</p></div>
          <div className="aq-metric"><FileText className="mb-2 h-5 w-5 text-[var(--aq-blue-600)]" /><p className="text-sm font-bold">STAR builder</p></div>
          <div className="aq-metric"><ShieldCheck className="mb-2 h-5 w-5 text-[var(--aq-blue-600)]" /><p className="text-sm font-bold">Follow-up traps</p></div>
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle>Choose interview lane</CardTitle><BriefcaseBusiness className="h-5 w-5" /></CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {jobTracks.filter((item) => tracks.includes(item.id)).map((item) => (
            <button key={item.id} aria-pressed={track === item.id} onClick={() => { setTrack(item.id); const next = availableSessions.find((s) => s.track === item.id); if (next) setSessionId(next.id); }} className={`rounded-md border p-4 text-left transition ${track === item.id ? "border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white shadow-sm" : "aq-row-card"}`}>
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className={`mt-1 text-xs font-bold ${track === item.id ? "opacity-75" : "text-slate-500 dark:text-slate-400"}`}>{item.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <Badge className="mb-2 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">Interview Simulator</Badge>
            <CardTitle className="text-2xl">30-minute mock interview</CardTitle>
            <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">Designed for speaking practice. Reveal the coach answer only after you try your own answer aloud.</p>
          </div>
          <Clock className="h-6 w-6 text-sky-500" />
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-[.85fr_1.15fr]">
          <div className="space-y-3">
            {availableSessions.map((s) => (
              <button key={s.id} aria-pressed={session?.id === s.id} onClick={() => setSessionId(s.id)} className={`w-full rounded-md border p-4 text-left ${session?.id === s.id ? "border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white shadow-sm" : "aq-row-card"}`}>
                <div className="flex items-center justify-between gap-2"><Badge className={session?.id === s.id ? "bg-white/15 text-white dark:bg-white/15 dark:text-white" : ""}>{s.role}</Badge><span className="text-xs font-semibold">{s.minutes} min</span></div>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className={`mt-1 text-xs font-bold ${session?.id === s.id ? "opacity-75" : "text-slate-500 dark:text-slate-400"}`}>{s.questionIds.length} high-value questions / warm-up to closing</p>
              </button>
            ))}
            <Button onClick={() => startSession()} size="lg" variant="hero" className="w-full"><Play className="h-4 w-4" /> Start 30-minute simulation</Button>
          </div>

          <div className="aq-subtle-panel p-4">
            {started && activeQuestion ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge>{phaseLabel(activeQuestion)}</Badge>
                  <Badge className="border-[var(--aq-blue-600)] bg-[var(--aq-blue-50)] text-[var(--aq-blue-800)] dark:text-[var(--aq-ink)]">~{Math.max(3, Math.round((session?.minutes ?? 30) / Math.max(1, sessionQuestions.length)))} min answer</Badge>
                </div>
                <Progress value={progress} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aq-muted)]">Question {index + 1}/{sessionQuestions.length}</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">{activeQuestion.question}</h2>
                </div>
                <div className="rounded-md border border-[var(--aq-border)] bg-white p-4 dark:bg-[#081d38]"><p className="text-xs font-semibold uppercase text-[var(--aq-muted)]">What they are testing</p><p className="mt-1 font-semibold">{activeQuestion.testing}</p></div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeQuestion.scoreRubric.map((item) => (
                    <button key={item} aria-pressed={Boolean(checked[item])} onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))} className={`flex items-center gap-2 rounded-md border p-3 text-left text-sm font-semibold ${checked[item] ? "border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white" : "border-[var(--aq-border)] bg-white dark:bg-[#081d38]"}`}><CheckCircle2 className="h-4 w-4" /> {item}</button>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={() => setCoachOpen((v) => !v)} variant="soft" size="lg"><Sparkles className="h-4 w-4" /> {coachOpen ? "Hide coach answer" : "Show coach answer"}</Button>
                  <Button onClick={nextQuestion} variant="hero" size="lg">{index + 1 >= sessionQuestions.length ? "Finish interview" : "Next question"} <ArrowRight className="h-4 w-4" /></Button>
                </div>
                {coachOpen ? <CoachAnswer question={activeQuestion} /> : null}
              </div>
            ) : (
              <div className="grid min-h-[24rem] place-items-center text-center">
                <div>
                  <PauseCircle className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                  <h3 className="text-2xl font-semibold">Ready when you are.</h3>
                  <p className="mx-auto mt-2 max-w-md font-bold text-slate-500 dark:text-slate-400">Pick a lane, start the simulation, answer aloud, then reveal the coach answer and score yourself against the rubric.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <Badge className="mb-2 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">Project-to-Interview Mapper</Badge>
            <CardTitle className="text-2xl">Choose projects. Get the pitch, STAR story, architecture talk, and interview answers.</CardTitle>
          </div>
          <Network className="h-6 w-6" />
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {projectStories.map((p) => {
            const on = selectedProjects.includes(p.id);
            return <button key={p.id} aria-pressed={on} onClick={() => setSelectedProjects((prev) => on ? prev.filter((id) => id !== p.id) : [...prev, p.id])} className={`rounded-md border p-4 text-left transition ${on ? "border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white shadow-sm" : "aq-row-card"}`}><Badge className={on ? "bg-white/15 text-white dark:bg-white/15 dark:text-white" : ""}>{p.shortName}</Badge><p className="mt-2 text-sm font-semibold">{p.headline}</p></button>;
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tracks.map((t) => <Button key={t} onClick={() => setMapperTrack(t)} variant={mapperTrack === t ? "default" : "soft"} size="sm">{t}</Button>)}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            {mappedProjects.length ? mappedProjects.map((p) => <ProjectMapperCard key={p.id} projectId={p.id} />) : <p className="aq-subtle-panel p-4 font-semibold text-[var(--aq-muted)]">Select at least one project.</p>}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Questions this project set can answer</h3>
            {mapperQuestions.map((q) => (
              <div key={q.id} className="aq-subtle-panel p-4">
                <div className="mb-2 flex flex-wrap gap-2"><Badge>{q.track}</Badge><Badge>{q.level}</Badge></div>
                <p className="font-semibold">{q.question}</p>
                <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">Say: {q.sayThis.slice(0, 190)}...</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button asChild size="lg" variant="hero"><Link to={`/cert/${pathFor(cert)}/knowledge`}>Practice exam questions</Link></Button>
        <Button asChild size="lg" variant="soft"><Link to={`/cert/${pathFor(cert)}/readiness`}>Check exam readiness</Link></Button>
        <Button asChild size="lg" variant="soft"><Link to={`/history?cert=${cert}`}>Review attempts</Link></Button>
      </div>
    </motion.div>
  );
}

function CoachAnswer({ question }: { question: InterviewQuestion }) {
  const project = projectStories.find((p) => p.id === question.bestProjects[0]);
  return <div className="aq-row-card space-y-3 p-4">
    <div className="aq-subtle-panel p-4"><p className="text-xs font-semibold uppercase text-[var(--aq-muted)]">Say this</p><p className="mt-1 font-semibold leading-relaxed">{question.sayThis}</p></div>
    <div><p className="mb-2 text-xs font-semibold uppercase text-[var(--aq-muted)]">Answer structure</p><div className="grid gap-2">{question.answerStructure.map((i) => <div key={i} className="flex items-center gap-2 rounded-md border border-[var(--aq-border)] bg-white p-3 text-sm font-semibold dark:bg-[#081d38]"><CheckCircle2 className="h-4 w-4 text-[var(--aq-blue-600)]" /> {i}</div>)}</div></div>
    <div className="grid gap-3 sm:grid-cols-2"><div><p className="mb-2 text-xs font-semibold uppercase text-[var(--aq-muted)]">Follow-up risks</p>{question.followUps.map((i) => <p key={i} className="mb-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-300/50 dark:bg-amber-300/10 dark:text-amber-100">{i}</p>)}</div><div><p className="mb-2 text-xs font-semibold uppercase text-[var(--aq-muted)]">Avoid saying</p>{question.avoid.map((i) => <p key={i} className="mb-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-950 dark:border-rose-300/50 dark:bg-rose-300/10 dark:text-rose-100">{i}</p>)}</div></div>
    {project ? <div className="rounded-md border border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] p-4 text-white"><p className="text-xs font-semibold uppercase opacity-80">Best project to mention</p><h3 className="mt-1 text-lg font-semibold">{project.title}</h3><p className="mt-2 text-sm font-semibold opacity-85">{project.thirtySecond}</p></div> : null}
  </div>;
}

function ProjectMapperCard({ projectId }: { projectId: string }) {
  const project = projectStories.find((p) => p.id === projectId);
  const [tab, setTab] = useState<"pitch" | "star" | "architecture" | "resume">("pitch");
  if (!project) return null;
  return <div className="aq-row-card p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><Badge>{project.shortName}</Badge><h3 className="mt-2 text-xl font-semibold">{project.title}</h3></div><Button asChild variant="soft" size="sm"><a href={project.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Source</a></Button></div>
    <div className="mt-3 flex flex-wrap gap-2">{(["pitch", "star", "architecture", "resume"] as const).map((t) => <Button key={t} onClick={() => setTab(t)} variant={tab === t ? "default" : "soft"} size="sm">{t}</Button>)}</div>
    <div className="mt-4 space-y-3">
      {tab === "pitch" ? <><div className="aq-subtle-panel p-4"><p className="text-xs font-semibold uppercase text-[var(--aq-muted)]">30-second pitch</p><p className="mt-1 font-semibold">{project.thirtySecond}</p></div><div className="aq-subtle-panel p-4"><p className="text-xs font-semibold uppercase text-[var(--aq-muted)]">2-minute version</p><p className="mt-1 text-sm font-semibold">{project.twoMinute}</p></div></> : null}
      {tab === "star" ? <div className="aq-subtle-panel p-4"><p className="text-sm font-semibold"><b>Situation:</b> {project.star.situation}</p><p className="mt-2 text-sm font-semibold"><b>Task:</b> {project.star.task}</p><p className="mt-2 text-sm font-semibold"><b>Action:</b> {project.star.action}</p><p className="mt-2 text-sm font-semibold"><b>Result:</b> {project.star.result}</p></div> : null}
      {tab === "architecture" ? <div className="grid gap-2">{project.architectureTalk.map((i, n) => <div key={i} className="flex gap-3 rounded-md border border-[var(--aq-border)] bg-white p-3 text-sm font-semibold dark:bg-[#081d38]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--aq-blue-700)] text-xs text-white">{n + 1}</span>{i}</div>)}<div className="rounded-md border border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] p-4 text-white"><p className="text-xs font-semibold uppercase opacity-80">Deep dive points</p>{project.technicalDeepDive.map((i) => <p key={i} className="mt-2 text-sm font-semibold">* {i}</p>)}</div></div> : null}
      {tab === "resume" ? <div className="grid gap-2">{project.resumeBullets.map((b) => <p key={b} className="rounded-md border border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] p-3 text-sm font-semibold text-white">{b}</p>)}<p className="aq-subtle-panel p-3 text-sm font-semibold">Metrics to mention: {project.metrics.join(" / ")}</p></div> : null}
    </div>
  </div>;
}
