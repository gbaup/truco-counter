# Implement Design Handoff

Implement one of the **Claude Design** handoff packages into this codebase, following its README + IMPLEMENTATION plan and the repo's existing patterns.

> Scope: this command is **only** for the design handoff packages under `design_handoffs/` produced in Claude Design — folders that contain `README.md`, `IMPLEMENTATION.md`, a `prototype/` and (usually) `reference-components/`. It is **not** the generic `handoff` skill; don't use it for anything else.

## Usage

`/implement-design-handoff [HANDOFF_NAME]`

- `HANDOFF_NAME` is the folder under `design_handoffs/` (e.g. `design_handoff_live_win_invite`).
- The `design_handoffs/` prefix is optional — `/implement-design-handoff relato` and `/implement-design-handoff design_handoffs/design_handoff_relato` both resolve.
- If omitted, list the available handoffs and ask which one.

## Step 1 — Resolve the handoff

If `$ARGUMENTS` is empty, run `ls design_handoffs/` and ask the user which package to implement. Stop until they answer.

Otherwise resolve the directory: try `design_handoffs/$ARGUMENTS`, then `design_handoffs/design_handoff_$ARGUMENTS`, then any folder under `design_handoffs/` whose name contains `$ARGUMENTS`. If nothing matches, list the folder and ask.

Confirm the resolved folder really is a Claude Design handoff (has `README.md` + `IMPLEMENTATION.md`). If not, stop and tell the user — this command doesn't handle other kinds of handoff.

## Step 2 — Read the package

Read, in order:

1. `design_handoffs/<NAME>/README.md` — what the feature is, scope, and the "musts".
2. `design_handoffs/<NAME>/IMPLEMENTATION.md` — the sequenced, file-by-file plan.

If the package references a design system spec (e.g. `design_handoff_truco_mesa/DESIGN.md`), treat that as the source of truth for tokens, type, spacing, and components. The `prototype/` HTML is visual reference only — **do not ship it**, and rebuild idiomatically rather than copying its inline styles.

## Step 3 — State the plan before writing code

Briefly restate:

- The **scope** the handoff declares (especially what is explicitly out of scope — e.g. "client-only, don't touch Prisma/API/SSE", "don't touch the data layer"). Respect it.
- The **ordered steps** from IMPLEMENTATION.md. Each step is sized to ship as its own PR.

Then confirm with the user whether to do the whole sequence or one step at a time. Default to working step by step on the current branch.

## Step 4 — Follow the codebase, not the prototype

Build with the repo's established patterns — never reinvent:

- **Tailwind v4** (`@import "tailwindcss"`, `@theme` tokens). Use the semantic tokens (`text-us`, `bg-surface`, `border-border`, `font-display`, `font-serif`, …) — no inline styles, no hard-coded hex when a token exists.
- **`tailwind-variants` + `tailwind-merge`** for class composition / variants.
- **`react-hook-form`** for forms; **`zod`** + the existing validators for validation.
- **`react-i18next`** for ALL user-facing copy. Add new keys to BOTH `locales/es.json` (formal) and `locales/es-coloquial.json` (Rioplatense) — most new copy leans coloquial. Never hard-code strings.
- **`next/font/google`** for fonts; **`@tanstack/react-query`** hooks (`hooks/`) for data; **services/** for fetch logic.
- Reuse existing primitives (`components/ui/*` — `Suit`, `Palito`, `PaperPanel`, etc.) instead of redrawing them.

If the handoff ships ready-to-copy `reference-components/`, copy those into the paths IMPLEMENTATION.md specifies and fix up imports.

## Step 5 — Per step: implement → verify

For each step:

1. Make the change exactly as the plan describes.
2. Add/extend locale keys if any copy was introduced.
3. Keep the diff presentational unless the handoff explicitly says otherwise — don't touch `hooks/useMatch.ts` score logic, `services/`, `app/api/*`, or `prisma/` unless instructed.
4. Run `npm run lint` (and `npm run build` at the end of the sequence).

## Step 6 — Wrap up

When the sequence (or the requested step) is done:

- Summarize what changed, file by file.
- List any new locale keys added.
- Run through the handoff's own **QA / acceptance** checklist if it has one.
- Remind the user of anything left out of scope (follow-ups the handoff named).

Do not open a PR automatically — if they want one, suggest `/feature-pr`.
