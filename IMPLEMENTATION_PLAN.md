# IMPLEMENTATION_PLAN.md

## Milestone order

## Subagent collaboration harness

For milestone work that affects product quality, use the three-role harness:

- UI/UX Revamp Lead: visual polish, information architecture, accessibility, interaction quality.
- Senior Software Engineer: implementation quality, architecture, state flow, performance, maintainability.
- QA and Product Lead: acceptance criteria, user journeys, prioritization, release risk.

Role briefs live in `docs/agents/`.

Subagents are advisory by default. The main agent integrates recommendations and keeps work inside the currently approved milestone.

## M0 - Vercel migration + harness reset

Goal:
The repo builds reliably, deploys on Vercel, and has operating docs that control future work.

Scope:

- Add harness docs.
- Add Vercel config.
- Clean npm config.
- Confirm build.
- Add demo/seed bank warning.
- Add Microsoft disclaimer.
- Update current state and known failures.

Do not build future features.

## M1 - Exam engine hardening

Goal:
Make the current local/static exam engine reliable and honest.

Scope:

- Remove stale Learn/Docs/Videos navigation.
- Finalize Exams / Exam Readiness / Job Readiness / History / Settings.
- Fix answer reveal behavior.
- Fix countdown timer.
- Fix Finish Now.
- Improve domain heatmap.
- Improve history.
- Add question flag placeholder.
- Add static duplicate-check script.
- Keep demo/seed warning.

## M1.5 - Professional Azure-blue design polish

Goal:
Make the M1 product surfaces feel credible, calm, and professional without changing milestone scope.

Scope:

- Keep Azure blue as the primary brand color.
- Improve typography, borders, cards, buttons, and progress states.
- Reduce decorative glow, blur, oversized rounding, and busy gradients.
- Replace playful labels with professional exam-prep language.
- Preserve demo/seed warnings and Microsoft non-affiliation disclaimers.
- Preserve M1 exam behavior, attempt persistence, history, retake seeds, and Finish Now behavior.

## M2 - Job readiness engine

Goal:
Make the Job Readiness experience genuinely useful before backend work.

Scope:

- 30-minute interview simulator.
- Track selector.
- Project selector.
- STAR builder.
- Pitch builder.
- Follow-up traps.
- Mistakes to avoid.
- Self-score rubric.
- Interview session history.

## M3 - Supabase foundation

Goal:
Add backend foundation without breaking local fallback.

Scope:

- Supabase Auth.
- profiles.
- quiz_attempts.
- interview_sessions.
- question_flags.
- RLS.
- Local fallback remains.

## M4 - GitHub project import

Goal:
Allow users to import public GitHub projects and generate draft stories.

Scope:

- Minimal-permission repo import.
- README/language fetch.
- imported_projects.
- project_stories.
- Draft/review/approve flow.
- Rate limits.
- Content-hash caching.

## M5 - Source-grounded question pipeline

Goal:
Replace static demo questions with approved source-grounded questions.

Scope:

- Microsoft Learn ingestion.
- Source docs.
- Source chunks.
- Embeddings.
- Batch question generation.
- Automated critic.
- Admin review queue.
- Approved live question pool.

## M6 - Admin review, analytics, launch hardening

Goal:
Prepare for a credible public launch after backend and source-grounded content exist.
