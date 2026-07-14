# CHANGELOG.md

## Unreleased

- Completed a stronger M1.5 professional Azure-blue design correction after the first polish pass was judged visually insufficient.
- Updated shared UI primitives with cleaner system typography, softer Azure borders, calmer Azure-blue buttons, badges, cards, progress states, and low-bandwidth-safe page backgrounds.
- Refined layout, path selection, cert overview, exam landing, practice arena, readiness, history, study mode, and job readiness styling for a more professional product feel.
- Reworked Job Readiness and History surfaces to remove remaining violet/slate-heavy styling, oversized radii, and unclear selected states.
- Added selected-state semantics to key Job Readiness controls.
- Fixed job-readiness copy regressions introduced by mojibake cleanup.
- Replaced playful labels such as Daily Boss, Swipe Cards, and Cozy cyber cave with professional wording.
- Moved retryable attempt-save error messaging onto the results screen where save failures actually surface.
- Added a three-subagent harness: UI/UX Revamp Lead, Senior Software Engineer, and QA and Product Lead.
- Captured initial subagent audit findings in `docs/reports/subagent-audit.md`.
- Normalized mobile navigation labels to approved M1 wording.
- Added demo/seed question-bank warning to cert landing pages.
- Removed stale `/learn` call-to-action from the legacy dashboard.
- Hardened attempt persistence so local save failures are visible and retryable.
- Approved and started M1 exam engine hardening.
- Migrated the app to the connected Vercel account and deployed production at `https://azure-quest-pwa.vercel.app`.
- Updated primary navigation to Exams, Exam Readiness, Job Readiness, History, and Settings.
- Added question flag/report placeholder to the practice arena.
- Preserved focus domain, focus tags, quiz ID, exam ID, and seed in attempt records and retake links.
- Updated History to separate Exam attempts, Quiz attempts, and Labs/practice attempts.
- Added package scripts for harness, question-bank, and route checks.
- Added M0 harness documentation.
- Added Vercel deployment configuration.
- Added demo/seed question-bank warning requirement to product docs.
- Added future cost and abuse control rules.
- Added visible demo/seed question-bank warning to exam landing, quiz/mock start lists, running practice arena, and answer review.
- Added Microsoft non-affiliation disclaimer to practice surfaces and global footer.
- Added ESLint 9 flat config so `npm run lint` works.
- Added harness, question-bank, and route smoke scripts.
- Verified `npm install --legacy-peer-deps`, `npm run build`, and `npm run lint`.
