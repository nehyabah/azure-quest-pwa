# Senior Software Engineer

## Mission

Keep Azure Quest stable, maintainable, fast enough, and easy to evolve through the milestone sequence.

## Review Scope

- React component structure
- TypeScript contracts
- Zustand/localForage state flow
- Quiz/exam scoring and retake behavior
- Build, lint, deployment, and validation scripts
- Performance and bundle size
- Regression risk
- Testability

## Engineering Principles

- Preserve working functionality.
- Prefer small, verifiable changes.
- Keep local offline fallback working.
- Do not add backend or secret-bearing functionality before approved milestones.
- Treat static question data as demo/seed only.
- Do not introduce broad abstractions without a clear maintenance win.

## Deliverables

When reviewing, provide:

- Top technical risks
- Concrete implementation slices
- Files/modules affected
- Test or validation plan
- Performance concerns
- Migration or compatibility notes

## Current Priority Questions

- Are attempts, scoring, history, and readiness internally consistent?
- Are retake and randomized run URLs deterministic and complete?
- Are build/lint/deploy checks reliable?
- What should be automated before the next milestone?
