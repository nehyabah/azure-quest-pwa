# CURRENT_STATE.md

## Current status

The app currently exists as a frontend-first PWA pulled from BabsBBG/azure-quest-pwa.

It has:

- React/Vite/TypeScript frontend.
- Tailwind UI.
- Zustand store.
- localForage local persistence.
- Static question bank.
- Static job readiness content.
- Practice/exam flow.
- Readiness concepts.
- History concepts.
- PWA setup.

## What currently works

- `npm install --legacy-peer-deps` passes.
- `npm run build` passes and generates `dist`.
- `npm run lint` passes after adding an ESLint 9 flat config.
- Harness validation passes with `node scripts/validate-harness.mjs`.
- Question bank validation loads 600 seed/demo questions with `node scripts/validate-question-bank.mjs`.
- Route smoke list script runs with `node scripts/check-routes.mjs`.
- Vercel deployment config exists with Vite framework, `dist` output, and SPA rewrite to `index.html`.
- Exam landing screens visibly label the question bank as demo/seed content before quiz and mock exam start buttons.
- The practice arena and answer review show the demo/seed warning or Microsoft non-affiliation disclaimer.
- Global layout footer shows the Microsoft non-affiliation disclaimer.
- Local browser verification passed on `http://localhost:5174/` for the home route, `cert/sc-300/knowledge`, and a small `SC-300` arena smoke route.
- Browser verification found no Vite error overlay and no current-page console errors on the verified `localhost:5174` routes.
- Production Vercel deployment is live at `https://azure-quest-pwa.vercel.app`.
- Production deployment ID: `dpl_Cr3LBoss2ApBGdFXEcG8XDZnLC9M`.
- M1 primary navigation now uses Exams, Exam Readiness, Job Readiness, History, and Settings.
- Practice runs show a question flag/report placeholder.
- Practice runs preserve focus domain, focus tags, quiz ID, exam ID, and seed for retakes.
- History separates Exam attempts, Quiz attempts, and Labs/practice attempts.
- Browser verification passed on production for exam landing, arena flag/Finish Now, and History separation.
- Final production redeploy is READY at `https://azure-quest-pwa.vercel.app`.
- Subagent harness added with UI/UX Revamp Lead, Senior Software Engineer, and QA and Product Lead roles.
- Initial subagent audit completed and captured in `docs/reports/subagent-audit.md`.
- Mobile navigation labels now match the approved terms exactly.
- Cert landing pages now show the demo/seed question-bank warning.
- Legacy dashboard no longer sends users to stale `/learn`.
- Attempt persistence now awaits local save and surfaces retryable save errors on the results screen instead of failing silently.
- M1.5 professional Azure-blue visual polish is in progress across shared UI primitives, layout, path selection, cert overview, exam landing, and practice arena.
- Playful labels such as Daily Boss, Swipe Cards, and Cozy cyber cave have been replaced with professional wording.

## What is demo/static

The following are demo/static until future milestones:

- Question bank.
- Domain coverage.
- Explanations.
- Job readiness project stories.
- Interview questions.
- Readiness calculations.

## Question bank status

The current question bank is static demo/seed content.

It is useful for testing:

- quiz flow
- timers
- history
- readiness calculations
- answer review
- UI behavior

It is not yet trusted as a production exam-prep bank because:

- questions are not traceable to Microsoft Learn source chunks
- duplicate/repetitive stems may exist
- explanations may be templated
- domain coverage is not yet verified against active exam blueprints

The UI must visibly label this content as demo/seed practice content until the source-grounded pipeline is implemented.

Required UI copy or equivalent:

"Demo practice bank: These questions are seed content for testing the platform. They are not official Microsoft questions and are not yet source-grounded or fully reviewed."

## What is not yet built

- Supabase auth.
- Supabase database.
- RLS.
- GitHub import.
- Project story generation.
- Source-grounded question generation.
- Microsoft Learn ingestion.
- Admin review queue.
- Question approval workflow.
- Cloud-synced attempts.
- Cost/rate-limit controls.

## Current approved milestone

M1.5 - Exam engine hardening + professional Azure-blue design polish.

## Current blockers

- The current question bank remains blocked from production trust until source-grounded Microsoft Learn ingestion, duplicate checks, and admin review exist.
- Supabase/auth/RLS are blocked until M3 is approved.
- GitHub OAuth/import is blocked until M4 is approved.
- LLM-backed project stories, embeddings, source ingestion, and generated questions are blocked until rate limits, content-hash caching, server-side secret handling, budget caps or kill switches, and failure logging exist.
- Bundle size warning remains: Vite reports the main JS chunk is larger than 500 kB after minification. This is not a build failure, but future M6 work should consider route-level code splitting.
- First dev-server verification attempt on `127.0.0.1:5173` did not respond and was restarted on `localhost:5174`, where checks passed.
- Automated M1 E2E tests are still missing.
- Duplicate validation remains soft by default and does not fail on duplicates yet.
