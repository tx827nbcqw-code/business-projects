# The Center Dispatch — First Working Prototype
**Status: code ready for review, NOT deployed or funded.**
Isolated in this folder. Does not alter the existing photography site.

## What exists
- Private-access-code-gated HTTP endpoint, one simple web page.
- Explicit, inspectable routing: **single**, **independent alternatives**, **complementary deliverables**.
- Two parallel AI Gateway calls for dual workflows, followed by an actual third **integration** call.
- Honest partial failures and actual model provenance. Does not pretend that LLM consensus is verification.
- Node built-in test runner: `npm test` (mocked model invocations, no billed APIs).

## What is NOT implemented
- No deployment, live paid model invocation, connected Google Drive data, durable job queue, real source checking, file output merge, OAuth or email actions.
- No cumulative cost cap/rate limiter; **do not expose it publicly** before adding durable per-user safeguards, deployment protection and budgets.
- No automatic model scoring; current routing heuristics are provisional.
- ChatGPT Plus and Claude Free subscriptions do **not** cover Vercel AI Gateway API usage.

## Run
Use Node 20+: `npm test` to run mock tests.
For a local UI: `npm start` then open http://localhost:3000. Local start uses a minimal server only. To call actual models, privately configure the following environment variables:
- `AI_GATEWAY_API_KEY` — obtain from Vercel AI Gateway (billing authorization required)
- `CENTER_ACCESS_TOKEN` — random private string, at least 20 characters; do not paste into any repo or shared Drive
- `OPENAI_MODEL`, `ANTHROPIC_MODEL` — **verified current model IDs** from https://vercel.com/ai-gateway/models
No secrets should ever be copied into Claude's chat or the public repository.

## Deployment proposal (requires owner's approval)
1. Review and merge a secure iteration only after tests and code review.
2. Create a **separate protected Vercel project** with root `the-center-dispatch`.
3. Add secret environment variables through the Vercel dashboard; set Gateway budget limits and app-level persistent quotas.
4. Make one small paid OpenAI call, one small paid Claude call, then a two-output merge; verify exact logs.
5. Only later integrate scoped Drive OAuth and other operational connectors.

## Claude review handoff
Owner has connected GitHub to Claude. Review branch `feature/the-center-dispatch-mvp-2026`, folder `the-center-dispatch/`.
Please inspect code, run mocked tests, and propose fixes **on the feature branch or via PR; do not deploy or merge to main** without approval.
Top issues to examine: request authentication, brute-force/rate limiting, provider model ID compatibility, payload limits when req.body is pre-parsed, timeout handling, failure-state integrity, provider token usage/budget accounting, cost caps, over-simple decomposition, and risks of unsafe or misleading model synthesis.
Optimize for **user attention saved and verified outcome quality**, not maximum number of model calls.
Keep proprietary Center records out of this **public** repository.

## Links
https://vercel.com/docs/ai-gateway/sdks-and-apis
https://vercel.com/docs/ai-gateway/getting-started/text
