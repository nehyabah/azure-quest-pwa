# KNOWN_BLOCKERS.md

## Production question-bank blocker

The current static question bank is not production-trusted.

Known blocker:

- The bank may contain repeated questions, repeated patterns, and weak explanations.
- The bank is not yet source-grounded.
- The bank must not be presented as official-quality practice content.

Blocked until:

- source-grounded Microsoft Learn ingestion exists
- generated questions trace to source chunks
- duplicate checks pass
- human/admin review approves questions

## M1.5 UI question-bank warning blocker

M0/M1/M1.5 completion is blocked unless the UI visibly labels the current question bank as demo/seed content.

Required copy or equivalent:

"Demo practice bank: These questions are seed content for testing the platform. They are not official Microsoft questions and are not yet source-grounded or fully reviewed."

## Future cost-control blocker

Before M4/M5 can launch publicly, cost controls must exist.

Blocked features until controls exist:

- GitHub repo import at scale
- project story generation
- Microsoft Learn ingestion
- embeddings
- question generation
- automated critic pass

Required before launch:

- per-user import limits
- per-user generation limits
- admin batch caps
- content-hash caching
- server-side-only LLM calls
- kill switch
- failure logging

Any feature that calls an LLM, imports GitHub repositories, generates questions, creates project stories, embeds content, or processes Microsoft Learn source material must include rate limits, content-hash caching, server-side secret handling, a budget cap or kill switch, and failure logging before it is considered complete.

## Backend blocker

Supabase is not part of M1.5.

Do not add backend work until M3 is approved.

## GitHub blocker

GitHub OAuth/import is not part of M1.5.

Do not add GitHub import until M4 is approved.
