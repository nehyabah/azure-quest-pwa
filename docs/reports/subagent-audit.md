# Subagent Audit

## Purpose

This report collects findings from the Azure Quest subagent harness:

- UI/UX Revamp Lead
- Senior Software Engineer
- QA and Product Lead

## Current Status

Initial subagent audit requested on 2026-07-14.

Three subagents completed read-only audits:

- UI/UX Revamp Lead: Kepler
- Senior Software Engineer: Faraday
- QA and Product Lead: Epicurus

## UI/UX Revamp Lead Findings

Top issues:

- Current UI is still blue-heavy, glassy, rounded, and gradient-driven, while product guidance calls for white, dark green, neutral greys, and a quieter premium feel.
- Some language is too playful for a cybersecurity credibility product, including labels such as Daily Boss, Pick your fighter, Swipe Cards, and Cozy cyber cave.
- Navigation is mostly aligned, but mobile labels had been shortened and should match the approved vocabulary.
- Major pages rely on many similar cards, badges, and bold text, weakening scan hierarchy.
- Demo/seed and Microsoft disclaimer messaging is present, but should be integrated into a calmer trust hierarchy.

Recommended improvements:

- Create restrained design tokens for dark green, neutral surfaces, subtle borders, fewer gradients, and consistent radii.
- Replace playful copy with professional language.
- Normalize navigation labels across desktop and mobile.
- Improve exam-flow hierarchy around timer, question count, answered count, Finish Now, flag/report, and demo warning.
- Redesign readiness/history as analytical dashboards with clearer filters and heatmap explanation.

Most affected files/pages:

- `src/components/Layout.tsx`
- `src/pages/PathHome.tsx`
- `src/pages/CertHome.tsx`
- `src/pages/KnowledgeCheck.tsx`
- `src/pages/PracticeArena.tsx`
- `src/pages/Readiness.tsx`
- `src/pages/PastExams.tsx`
- `src/pages/JobReadiness.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`

## Senior Software Engineer Findings

Top risks:

- Attempt persistence could fail silently because the UI marked a run saved before `recordAttempt` completed.
- M1 behavior is mostly implemented but under-tested.
- Mobile navigation labels needed to match acceptance wording.
- Demo/seed warning coverage should extend to every practice-start surface that can create attempts.
- Duplicate question validation currently warns but does not fail.

Technical debt:

- `PracticeArena` owns a large amount of state and workflow behavior and is the highest-value refactor/test target.
- Weighted question selection assumes sane domain weights.
- ESLint and TypeScript checks are still minimal.
- Route smoke script lists routes but does not render them.

Recommended implementation slices:

- Await attempt persistence and surface save errors.
- Add focused tests for scoring, unanswered questions, retake URLs, randomized URLs, and history grouping.
- Add a real route/browser smoke check.
- Split duplicate checking into warn and strict modes.
- Normalize navigation labels and remove stale Learn/Docs/Videos paths from active surfaces.

## QA and Product Lead Findings

Top product gaps:

- Mobile nav labels should exactly match Exams, Exam Readiness, Job Readiness, History, Settings.
- Cert landing should show the demo-bank warning because it introduces quizzes, mocks, and readiness.
- Legacy dashboard still linked to `/learn`.
- M2 job-readiness gaps remain: Detection Engineering, typed answers, session completion, and interview history.
- Duplicate checker is visibility-only.

Critical journeys:

- Start quiz/mock from cert exam page, see demo-bank warning and Microsoft disclaimer, complete run, then review answers.
- Finish Now with unanswered questions and verify unanswered scores wrong.
- Complete exam, verify History entry, domain report, readiness update, retake same seed, and new randomized run.
- Use Job Readiness from track selection through answer coaching and self-score rubric.
- Reset/export local data from Settings without breaking hydration/history.

Acceptance tests needed:

- E2E quiz completion and Finish Now with unanswered questions.
- E2E timer countdown/auto-finish.
- E2E History sections for exams, quizzes, and labs.
- E2E retake seed equality and new randomized difference.
- E2E demo-bank warning and Microsoft disclaimer visibility.
- Unit tests for `scoreAttempt`, `pickQuestions`, readiness/domain aggregation, and question-bank validation behavior.

## Immediate Actions Taken

- Added subagent role briefs under `docs/agents/`.
- Updated `AGENTS.md`, `IMPLEMENTATION_PLAN.md`, and `ROADMAP.md` with the three-role subagent operating model.
- Normalized mobile navigation labels to the approved wording.
- Added the demo-bank warning to cert landing pages.
- Removed the stale `/learn` call-to-action from the legacy dashboard.
- Hardened attempt persistence so save errors are surfaced and retryable.

## M1.5 Follow-Up Audit

Follow-up audit requested on 2026-07-14 after the first M1.5 visual pass was judged too timid.

Three subagents completed read-only audits:

- UI/UX Revamp Lead: Volta
- Senior Software Developer: Cicero
- QA and Product Lead: Huygens

Release-blocking or high-impact findings:

- Job Readiness still carried the weakest polish, including violet accents, oversized rounded panels, old slate-heavy selected states, and heavy typography.
- History attempt cards lagged behind the newer landing surfaces.
- Global Azure borders were too saturated and the page background was too busy.
- A remote Google font import was risky for PWA/offline and low-bandwidth behavior.
- Low-bandwidth mode was visually overridden by the richer page shell.
- Selectable Job Readiness buttons lacked explicit selected-state semantics.
- Mojibake cleanup damaged interview coaching copy with strings such as `thinking-not`, `notifications-all`, `gaps-stale`, `done-in`, and `principal-is`.
- Study Mode still had childish learner-facing copy: Explain Like I'm 5 and Next bite.
- Readiness trend copy used developer shorthand: `-> same`.

Follow-up actions taken:

- Removed the remote font import and moved to a professional system font stack.
- Softened Azure borders, reduced shadows, and simplified page backgrounds.
- Fixed low-bandwidth mode so it bypasses the richer page shell.
- Reworked Job Readiness, History, Study Mode, and Readiness copy/styling to match the M1.5 professional tone.
- Added `aria-pressed` to key selectable Job Readiness controls.
- Fixed the damaged interview coaching copy.
- Re-ran lint, harness validation, question validation, route checks, and production build.

## Recommended Next Step

Finish M1 hardening by adding automated tests for exam scoring, Finish Now, history grouping, retake seed behavior, and demo-warning visibility.
