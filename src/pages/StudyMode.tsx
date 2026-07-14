import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { concepts } from "../data/concepts";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function StudyMode() {
  const [index, setIndex] = useState(0);
  const [eli5, setEli5] = useState(false);
  const concept = concepts[index % concepts.length];

  function next() {
    setEli5(false);
    setIndex((i) => i + 1);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="h-4 w-4" /> Home</Link></Button>
        <Badge>{index + 1}/{concepts.length}</Badge>
      </div>

      <motion.div key={concept.id} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="aq-hero min-h-[520px] overflow-hidden">
          <CardHeader>
            <div>
              <Badge className="mb-3 border-[var(--aq-blue-600)] bg-[var(--aq-blue-700)] text-white">{concept.cert}</Badge>
              <CardTitle className="text-4xl">{concept.emoji} {concept.title}</CardTitle>
            </div>
            <Sparkles className="h-8 w-8 text-[var(--aq-blue-600)]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold leading-tight">{concept.punchline}</p>
            <pre className="rounded-md border border-[var(--aq-border)] bg-[#061227] p-5 text-center text-lg font-semibold text-[#d7ebff]">{concept.diagram}</pre>
            <div className="aq-subtle-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aq-muted)]">Quick highlight</p>
              <p className="text-xl font-semibold">{concept.highlight}</p>
            </div>

            {eli5 ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="aq-subtle-panel p-5">
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--aq-muted)]"><BookOpen className="h-4 w-4" /> Plain-language explanation</p>
                <p className="text-xl font-semibold">{concept.eli5}</p>
                <div className="mt-4 rounded-md border border-[var(--aq-border)] bg-white/80 p-4 dark:bg-[#081d38]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aq-muted)]">Real-world comparison</p>
                  <p className="mt-1 text-lg font-semibold">{concept.realLife}</p>
                </div>
              </motion.div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => setEli5((v) => !v)} variant="soft" size="lg" className="h-16"><BookOpen /> Plain-language view</Button>
        <Button onClick={next} variant="hero" size="lg" className="h-16">Next concept</Button>
      </div>
    </motion.div>
  );
}
