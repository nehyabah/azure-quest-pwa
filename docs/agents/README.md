# Azure Quest Subagent Harness

Azure Quest uses three subagent roles to improve product quality without losing milestone discipline.

The roles are:

- UI/UX Revamp Lead
- Senior Software Engineer
- QA and Product Lead

Subagents are advisory by default. They may implement only when the user explicitly approves delegated implementation and the main agent assigns a bounded, non-overlapping file scope.

## Coordination Contract

- Read `AGENTS.md` before acting.
- Stay inside the currently approved milestone.
- Preserve the demo/seed question-bank warning.
- Preserve the Microsoft non-affiliation disclaimer.
- Do not add Supabase, GitHub import, LLM calls, source ingestion, payments, or native apps unless that milestone is approved.
- Report findings with clear severity, affected files/pages, and acceptance criteria.

## Output Contract

Each subagent report should include:

- Scope reviewed
- Findings
- Recommended changes
- Acceptance criteria
- Risks or blockers
- Suggested priority
