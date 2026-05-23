---
name: stack-context
description: Use this skill whenever reasoning about scalability, performance, cost, deployment, database, or operational constraints of this application. Contains the specific tech stack (Vercel for hosting, Supabase for database/auth/storage) and the known gotchas, quotas, and scaling levers for each. Trigger proactively for any infra decision, capacity question, latency or cost concern, or when proposing architectural changes — never reason about scaling in the abstract when the concrete stack is documented here.
---

# Stack Context

This document captures the actual stack and operational realities of this application. Use it as ground truth when analyzing any decision with infra implications. Prefer concrete reasoning about *this* stack over generic advice.

---

## Current stack

- **Hosting / serverless**: Vercel
- **Database, auth, storage, realtime**: Supabase
- **Plan tiers**: _(fill in: Vercel Hobby/Pro/Enterprise, Supabase Free/Pro/Team/Enterprise)_
- **Primary region**: _(fill in, e.g., us-east-1)_
- **Approximate scale today**: _(fill in: MAU, peak RPS, DB size, monthly compute)_
- **Known bottlenecks**: _(fill in any current pain points)_

> Anything marked _(fill in)_ above is project-specific and should be edited by the team. The rest of this document is general knowledge about Vercel + Supabase that applies regardless.

---

## Vercel: what to think about

### Compute model

- **Serverless functions** run on AWS Lambda underneath, billed per invocation + duration. Cold starts apply.
- **Edge functions** run on V8 isolates close to the user. No Node APIs (no `fs`, limited npm support), but ~zero cold start and lower latency. Strict CPU/memory limits.
- **Static + ISR**: static pages cached at edge; ISR re-renders on a schedule or on-demand. Often the cheapest path to scale read-heavy surfaces.

### Limits that bite at scale

- **Function execution timeout**: ~10s on Hobby, ~60s on Pro, up to ~900s on Enterprise. Long-running work (imports, large reports, ML inference) needs to be moved off the request path — queue + worker, or external job runner.
- **Function payload limits**: response and request body caps. Large uploads should go direct-to-storage (Supabase Storage signed URL), not through a function.
- **Concurrent executions**: each plan has a soft concurrency ceiling. Spikes can throttle.
- **Bandwidth and build minutes**: metered per plan; surprise overages are a common cost story.
- **Single-region by default** for Node serverless functions. Going multi-region for serverless = Edge runtime or duplicated deployments.

### Scaling levers

- Move read-heavy pages to ISR or static
- Move latency-sensitive logic to Edge runtime where possible
- Cache at the edge (`Cache-Control`, `stale-while-revalidate`)
- Use Vercel KV or Edge Config for hot reads instead of round-tripping to Postgres
- For long jobs: external queue (e.g., Inngest, QStash, Trigger.dev) or a separate worker host

### Cost watch-outs

- Image optimization quota — large catalogs blow through it fast
- Function GB-hours on long Node runtimes
- Bandwidth on uncached responses
- Log retention and analytics on higher plans

---

## Supabase: what to think about

### Connection management (most common scaling pitfall)

Vercel serverless + Postgres is a hazard: every function invocation can open a new DB connection, and Postgres exhausts connections fast.

- **Always use Supabase's connection pooler** (Supavisor / pgbouncer) for serverless workloads. Use the *pooled* connection string, not the direct one.
- Transaction mode pooling is the default and works for most serverless code. Session-mode pooling is needed for some features (LISTEN/NOTIFY, prepared statements) but holds connections longer.
- Direct connections are limited per plan tier (tens to a few hundred). The pooler exposes thousands of "virtual" connections on top.

### Row-Level Security (RLS) perf

- RLS policies run on every query. Complex policies (joins, function calls, subqueries) can dominate query time at scale.
- Audit RLS as part of any performance work. `EXPLAIN ANALYZE` with `SET ROLE` to simulate a user.
- Common pattern: index the columns used in RLS predicates; flatten policies where possible.

### Tier-gated features

- **Point-in-time recovery (PITR)**: Pro+
- **Read replicas**: Team+
- **Branching** (database previews per PR): Pro+
- **Compute size scaling**: Pro+, with notable cost steps
- **Custom SMTP / longer log retention / higher API rate limits**: paid tiers

### Realtime

- Concurrent connection and messages-per-second quotas are tier-dependent
- Realtime presence/broadcast can fan out quickly — measure before depending on it for a hot surface

### Storage

- Object uploads via signed URLs (don't proxy through a Vercel function)
- Egress is billed; CDN-cached delivery is usually included but check current pricing

### Auth

- MAU caps are tier-dependent
- Auth hooks (sending custom emails, custom claims) run server-side and add latency

---

## Cross-cutting patterns

- **Serverless + Postgres = connection pooling is non-negotiable.** Any decision that increases function invocation rate should be evaluated against pooler capacity.
- **Latency stack**: user → Vercel edge → Vercel function region → Supabase region. If Vercel function region ≠ Supabase region, every query pays a cross-region round-trip. Co-locate.
- **Cold start sensitivity**: low-traffic surfaces on Node serverless will cold-start; Edge runtime or always-warm hosting is the fix.
- **Egress is the silent cost**: cached/CDN traffic is cheap; uncached function responses and uncached storage egress add up.

---

## What this skill is NOT

- Not a replacement for actual measurement. When proposing a scaling change, ask "have we measured this?" — pgstat, EXPLAIN, Vercel observability, slow query logs.
- Not exhaustive. If a decision touches a Vercel/Supabase area not covered above (e.g., pgvector at scale, Vercel cron jobs, Supabase Edge Functions), say so and flag the gap rather than improvising.

---

## How to extend this skill

When the team learns something material about this stack — a quota you hit, a query pattern that broke, a vendor change — add it under the relevant section above. This skill is meant to grow. Keep entries short and specific (the situation, what surfaced it, the lever that fixed or would fix it).
