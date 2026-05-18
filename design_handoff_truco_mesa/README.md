# Handoff: TrucoPro · Mesa redesign

## Overview

A full visual redesign of **TrucoPro**, the Uruguayan-truco scorekeeper
with Glicko ranking and match history. The new direction is called
**Mesa** and re-imagines the app as a dark felt table on which sit
cream-paper notebook sheets where the score (palitos) is hand-drawn.
The brand voice is subtly Rioplatense — coloquial copy, Spanish-suit
card pips ("baraja española"), and a two-team identity system based
on **purple (Nosotros)** vs **emerald (Ellos)**.

The redesign covers **7 screens**: Login, Setup, Counter (the live
match scoreboard), Sidebar drawer, Profile, Statistics / Ranking, and
Match History. The Versus screen is not yet designed and is a
follow-up.

## About the design files

The files under `prototype/` are **design references created in HTML +
React (Babel-transpiled in-browser)**. They are NOT production code —
they exist to show the intended look, layout, and behavior. Your task
is to **recreate these designs in the actual Next.js / Tailwind v4
codebase at the repo root**, following its established patterns
(components/, app/, services/, locales/, react-i18next, etc.).

Use `prototype/TrucoPro Redesign.html` as a visual reference (open it
in a browser — uses a CDN-loaded React + Babel) and `DESIGN.md` as the
authoritative spec.

## Fidelity

**High-fidelity (hifi).** Pixel-perfect mockups with final colors,
typography, spacing, radii, and interactions. The developer should
reproduce these designs pixel-for-pixel in the target codebase. Where
the codebase already has an idiomatic way of doing something (e.g.
`tailwind-variants` for variants, `useTranslation` for copy, `next/font`
for typography), use those rather than inline styles or hard-coded
strings.

## What's inside this package

```
design_handoff_truco_mesa/
├── README.md                          ← you are here
├── DESIGN.md                          ← the design-system spec (single source of truth)
├── IMPLEMENTATION.md                  ← file-by-file migration plan, ordered
├── tailwind-theme.css                 ← drop-in replacement for app/globals.css @theme block
├── reference-components/              ← ready-to-copy primitives
│   ├── Suit.tsx                       ← Spanish-suit pip (espada · basto · oro · copa)
│   ├── Palito.tsx                     ← single tally mark + Tally column helper
│   └── PaperPanel.tsx                 ← the signature cream-paper panel
└── prototype/                         ← visual reference, NOT to ship
    ├── TrucoPro Redesign.html         ← open in browser; full 7-screen canvas
    ├── common.jsx                     ← shared (PhoneFrame, icons, fake data)
    ├── variant-c.jsx                  ← Mesa primitives + Login, Setup, Counter
    ├── variant-c2.jsx                 ← Mesa Sidebar, Profile, Stats, History
    ├── design-canvas.jsx              ← canvas tooling (not part of the design)
    └── tweaks-panel.jsx               ← canvas tooling (not part of the design)
```

## How to read this package

1. **Open `prototype/TrucoPro Redesign.html`** in a browser to see all
   7 screens side-by-side. Each screen renders inside an iOS frame.
   Use the canvas to compare layouts; click any artboard to focus it
   fullscreen (← / → / Esc to navigate).
2. **Read `DESIGN.md`** front to back. It's the source of truth for
   colors, typography, spacing, components, and the philosophy
   ("Mesa / Papel / Datos" three-worlds model). YAML front matter has
   machine-readable tokens; the markdown body explains the *why*.
3. **Follow `IMPLEMENTATION.md`** step by step. Each step is sized to
   ship as a single PR. The plan touches only presentational code —
   data layer (`hooks/useMatch.ts`, `services/`, `app/api/`, Prisma)
   stays untouched.

## Screens

| # | Screen | Path | Purpose |
| --- | --- | --- | --- |
| 1 | Login | `app/login/page.tsx` | Username + password → enter the app. Two decorative Spanish cards float in the background. |
| 2 | Setup (Armar mesa) | `app/page.tsx` / `MatchSetup.tsx` | Pick players for Nosotros & Ellos, choose target score (20/30/40/50), start. |
| 3 | Counter | `MatchCounter.tsx` + `TeamCounter.tsx` + `Controls.tsx` | The live scoreboard. Two columns of `PaperPanel`s where each team's score is drawn as palitos (square casitas). Bottom +/− controls per team. |
| 4 | Sidebar | `SideDrawer.tsx` | Right-side nav drawer with a Spanish-card-style user header and 5 nav links. |
| 5 | Profile | `app/profile/page.tsx` | Hero "player card" (1 de espada) showing rating, then stat tiles (W / L / %), then recent matches. |
| 6 | Statistics / Ranking | `app/statistics/page.tsx` | Glicko/Elo tab switcher, top-1 spotlight (paper card), then leaderboard table. |
| 7 | History | `app/history/page.tsx` + `MatchList.tsx` + `MatchCard.tsx` | Sessions grouped by date; each match a compact row with mini Spanish-card icon (G/P) + scores. |

## Design tokens at a glance

Full schema in `DESIGN.md` front matter. Key tokens:

### Colors (hex)

```
background      #0D100E    surface         #161B18    surface-elevated #1D2420
border          #2A3128    text            #F0EDE4    text-dim        #8F8A7F
text-mute       #5D584F    paper           #F4ECDB    paper-shade     #E8DFC7
paper-ink       #1A1410    paper-line      #C2A878    us              #8B5CF6
us-deep         #6D28D9    them            #34D399    them-deep       #047857
danger          #EF4444    warning         #E0A83A
```

### Typography

- **Inter** (sans) — UI, body, labels. Weights 400-900.
- **Crimson Pro** (serif, italic) — coloquial voice, headers, names. 400, 600, 700.
- **Space Grotesk** (display) — numbers, ratings, scores. 600, 700.

### Radii

`xs 5px · sm 9px · md 12px · lg 14px · xl 16px · 2xl 22px · full 9999px`

### Spacing scale

`xs 4 · sm 6 · md 10 · lg 14 · xl 20 · 2xl 28 · 3xl 56`

### Shadows

`card · paper · raised · hero` (see `DESIGN.md` § Elevation).

## Critical "musts"

These come up across every screen — do not skip:

1. **Spanish suits only.** Espada / basto / oro / copa. Never `♠` `♥`
   `♦` `♣`. See `Suit.tsx`.
2. **Palitos are square casitas.** 4 sides + 5th diagonal. NOT five
   parallel lines. See `Palito.tsx` and `DESIGN.md` § Palito.
3. **`us` and `them` are team identities, not jerarchy.** Don't gradient
   them together. Don't subordinate one to the other.
4. **Paper is a recortable element, not a theme.** It appears as panels
   on top of the dark mesa. No "light mode".
5. **No emoji in the UI.** Icons are SVG. Suits are SVG.
6. **Coloquial copy where applicable.** Add new strings to BOTH
   `locales/es.json` and `locales/es-coloquial.json`. Most new copy
   lives in `es-coloquial.json` ("armar mesa", "levantarse de la mesa",
   "el de arriba", etc.).
7. **42px minimum hit targets**, especially in the counter `+/−` controls.

## Interactions & behavior

The current behavior is preserved across the redesign — the only
changes are presentational. Specifically:

- `useMatch` hook continues to own match state and persist via
  localStorage. Score increments/decrements behave the same.
- Sidebar opens/closes with the existing hamburger.
- Login posts to `/api/auth/login`, redirects to `/` on success.
- Match history sessions are grouped by 12-hour gaps (existing logic
  in `MatchList.tsx`).
- Match cards still expand on tap to show rating deltas.

New interactions to add (small):

- **Drawing animation** on the palito: when a point is added, the
  newest stroke can animate in with a 200ms `stroke-dasharray`
  drawing animation. Optional but recommended; deferred to a
  follow-up if time-constrained.
- **Score tick on +/−**: subtle `transform: scale(0.95)` press state.

## State management

Unchanged. `useMatch`, `useLogin`, `getMatches`, `getUserStats` are all
already wired correctly. The redesign reads the same data; it just
renders it differently.

## Assets

No new asset files needed. Everything is SVG inline (suits, palitos,
icons). Fonts are loaded via `next/font/google`.

## Locales

See `IMPLEMENTATION.md` § "Locale keys to add" for the full list of
new keys with their es / es-coloquial values.

## Validation

You can validate `DESIGN.md` against the spec:

```bash
npx @google/design.md lint DESIGN.md
```

Or export to a different format (Tailwind v3 / W3C tokens):

```bash
npx @google/design.md export --format css-tailwind DESIGN.md
```

## Recommended PR sequence

1. Add `tailwind-theme.css` content to `globals.css` (with aliases).
2. Swap fonts in `app/layout.tsx`.
3. Add `Suit.tsx`, `Palito.tsx`, `PaperPanel.tsx` primitives.
4. Migrate Counter (`MatchCounter` + `TeamCounter` + `Controls`).
5. Migrate Setup (`MatchSetup`).
6. Migrate Sidebar (`SideDrawer`).
7. Migrate Profile + Statistics + History.
8. Migrate Login.
9. Remove aliases, delete old `TallyMarks.tsx`, final lint pass.

---

Questions? The source of truth for any disagreement is **`DESIGN.md`**
(the spec) — not the HTML prototype. The HTML may have rendering
quirks (e.g. inline styles where Tailwind would be cleaner); rebuild
idiomatically using the codebase's existing patterns.
