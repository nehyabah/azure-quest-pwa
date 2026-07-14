# AGENTS.md - Azure Quest Operating Manual

## Mission

Build a public, free-to-use PWA for Microsoft security certification practice and job readiness.

The product has two halves:

1. Practice exam engine for SC-300, AZ-500, and SC-500.
2. Job readiness engine that turns GitHub projects into interview-ready stories, pitches, STAR answers, architecture walkthroughs, and mock interview simulations.

This product is not affiliated with or endorsed by Microsoft.

## Current approved milestone

M1.5 - Exam engine hardening + professional Azure-blue design polish.

The only approved work now:

- Remove stale Learn/Docs/Videos from active navigation.
- Ensure main navigation uses Exams, Exam Readiness, Job Readiness, History, and Settings.
- Keep answers hidden until quiz/exam completion.
- Ensure timer counts down.
- Ensure Finish Now works.
- Ensure unanswered questions count as incorrect.
- Ensure attempt history saves.
- Ensure History separates quizzes and exams.
- Ensure Retake same seed works.
- Ensure New randomized run works.
- Ensure domain heatmap updates after completion.
- Add static duplicate-check script if missing.
- Add question flag/report UI placeholder.
- Keep visible demo/seed question-bank warning in the UI.
- Update CURRENT_STATE.md.
- Update KNOWN_FAILURES.md.
- Update KNOWN_BLOCKERS.md.
- Tighten the visual system for active M1 surfaces using Azure blue, professional typography, cleaner borders, restrained cards, and less playful language.

Do not build Supabase yet.
Do not build GitHub OAuth yet.
Do not build LLM question generation yet.
Do not regenerate the question bank yet.
Do not start a future product milestone or change core product scope beyond this M1.5 design polish.
Do not implement future milestones unless explicitly approved.

The roadmap is context only. Complete only the current approved milestone.

## Source of truth order

When files conflict, trust them in this order:

1. AGENTS.md
2. PRODUCT_SPEC.md
3. ACCEPTANCE_CRITERIA.md
4. ARCHITECTURE.md
5. SECURITY.md
6. CURRENT_STATE.md
7. Existing implementation

If code conflicts with source-of-truth docs, update the code or report the mismatch.

## Subagent operating model

Azure Quest uses three named subagent roles for meaningful product work. They are advisory by default unless the user explicitly asks for implementation delegation.

Use subagents when the work affects multiple surfaces, changes user experience, changes core exam behavior, or prepares a milestone handoff.

Required subagents:

1. UI/UX Revamp Lead
2. Senior Software Engineer
3. QA and Product Lead

Authoritative role briefs live in:

- `docs/agents/ui-ux-revamp-lead.md`
- `docs/agents/senior-software-engineer.md`
- `docs/agents/qa-product-lead.md`

Coordination rules:

- The main agent owns final decisions, integration, and source-of-truth updates.
- Subagents must not override AGENTS.md, PRODUCT_SPEC.md, SECURITY.md, or ACCEPTANCE_CRITERIA.md.
- Subagents must not start future milestones without explicit approval.
- Subagents must keep the demo/seed question-bank warning visible.
- Subagents must preserve the Microsoft non-affiliation disclaimer.
- Subagents must not add Supabase, GitHub import, LLM calls, source ingestion, or payments unless the matching milestone is approved.
- If subagents disagree, prefer the option that is safest for learners, easiest to verify, and closest to the current approved milestone.

Default review sequence:

1. UI/UX Revamp Lead reviews visual hierarchy, clarity, trust, navigation, interaction ergonomics, and accessibility.
2. Senior Software Engineer reviews architecture, state flow, data contracts, tests, build stability, performance, and maintainability.
3. QA and Product Lead reviews user journeys, acceptance criteria, release risk, prioritization, and product coherence.

Every subagent-backed run should update `CURRENT_STATE.md`, `KNOWN_FAILURES.md`, and the relevant `docs/reports/*` file with the result.

## Non-negotiable rules

- Do not build outside the currently approved milestone.
- Do not rewrite the whole app unless explicitly instructed.
- Do not remove working functionality without replacing it and updating tests/checks.
- Do not expose LLM API keys in frontend code.
- Do not request GitHub write permissions.
- Do not add payments in v1.
- Do not add native mobile apps in v1.
- Do not add voice/audio interview grading in v1.
- Do not add community-submitted questions in v1.
- Do not claim Microsoft affiliation.
- Do not present generated or static questions as official Microsoft questions.
- Every exam/practice page must show: "Not affiliated with or endorsed by Microsoft."
- If a build/test fails, stop and report the failure.
- Do not claim success unless required commands pass.

## Question bank trust rule

The current static question bank is seed/demo content only.

Until the source-grounded Microsoft Learn pipeline is built and questions are reviewed, the UI must clearly label practice content as demo/seed practice content.

Do not present the current bank as official, complete, source-grounded, or production-quality.

Completion is blocked if users can take quizzes/exams without seeing that the current question bank is demo/seed content.

Required UI copy or equivalent:

"Demo practice bank: These questions are seed content for testing the platform. They are not official Microsoft questions and are not yet source-grounded or fully reviewed."

This must appear:

- Before starting a quiz.
- Before starting a mock exam.
- On practice/exam landing screens.
- Near the Microsoft non-affiliation disclaimer.

## Future source-grounding rule

Long-term, every production question must trace back to a specific source chunk from official Microsoft Learn / MicrosoftDocs content.

A production question is not trusted unless it has:

- source_chunk_id
- source URL
- cert ID
- domain ID
- explanation
- why-wrong explanation per option
- review status
- approval status

## Cost and abuse control rule

Any feature that calls an LLM, imports GitHub repositories, generates questions, creates project stories, embeds content, or processes Microsoft Learn source material must include cost and abuse controls before it is considered complete.

Required controls:

- No live LLM question generation on the user quiz/exam path.
- Question generation must be batch/admin-triggered only.
- Batch generation must have a budget cap per run.
- LLM calls must run server-side only.
- Repo imports must be rate-limited per user.
- Project story generation must be cached by README/content hash.
- Source ingestion must be cached by content hash.
- Embedding generation must avoid re-processing unchanged content.
- Admin kill switch or config flag must exist for generation jobs.
- Failures must be logged and reported, not silently retried forever.

Completion is blocked for future M4/M5 work if these controls are missing.

## GitHub permission rule

For v1, do not request GitHub write permissions.

Prefer public repo import using minimal permissions.

Do not use broad repository scopes unless explicitly approved.

Private repo support is not part of the current milestone.

## Product constraints

Frontend:

- React
- TypeScript
- Vite
- Tailwind
- Zustand
- localForage
- PWA

Hosting:

- Vercel for frontend
- Supabase later for backend/auth/database

## Visual direction

Professional, quiet, premium.

Primary palette for M1.5:

- White
- Azure blue
- Neutral greys

Avoid:

- Loud purple
- Unnecessary decorative glow/blur
- Cartoon-heavy UI
- Oversized buttons
- Overly bold fonts
- Busy gradients
- Childish gamification

The app should feel credible for cybersecurity learners and early-career security professionals.

## Required build checks

Before marking work complete, run:

```bash
npm install --legacy-peer-deps
npm run build
```

If lint/test scripts exist, also run:

```bash
npm run lint
npm test
```

If these commands fail, completion is blocked.

## Completion report required

Every agent run must end with:

- Files changed
- What was preserved
- What was removed
- Commands run
- Build result
- Tests/checks run
- Known failures
- Known remaining issues
- Next recommended step
