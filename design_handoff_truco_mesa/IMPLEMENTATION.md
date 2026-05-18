# IMPLEMENTATION — File-by-file migration plan

This document maps the **TrucoPro · Mesa** design (`DESIGN.md`) onto
the existing Next.js 16 + Tailwind v4 codebase at the repo root.

It is sequenced — do the steps in order. Each step is independent
enough to ship as its own PR.

---

## 0. Pre-flight

- **Codebase**: Next.js 16 App Router · TypeScript · Tailwind v4
  (`@import "tailwindcss"`) · `tailwind-merge` + `tailwind-variants`
  for class composition · `react-i18next` for copy.
- **Locales**: any new user-facing string MUST be added to BOTH
  `locales/es.json` (formal) and `locales/es-coloquial.json`
  (Rioplatense). The new design leans coloquial, so most of the new
  strings (`armar mesa`, `levantarse de la mesa`, `el de arriba`,
  etc.) go in `es-coloquial.json`. Use neutral equivalents in `es.json`.
- **Don't touch the data layer**. `hooks/useMatch.ts`, `services/*`,
  `app/api/*`, Prisma schema, the Glicko logic — all stay as-is.
  This is a presentational redesign.

---

## 1. Design tokens — `app/globals.css`

**Action**: replace the existing `@theme inline { … }` block with the
one in `tailwind-theme.css` of this handoff.

- The new tokens add: `paper`, `paper-shade`, `paper-ink`, `paper-line`,
  `text`, `text-dim`, `text-mute`, `us`, `us-deep`, `them`, `them-deep`,
  shadows (`shadow-card`, `shadow-paper`, etc.), font variables
  (`font-sans`, `font-serif`, `font-display`).
- It keeps temporary aliases for `primary-*` / `secondary-*` so existing
  classes don't break during migration. **Remove those aliases in the
  final cleanup PR** once every usage has moved over.
- Includes a `.paper-lines` utility and `.text-display-*` / `.text-heading-*` /
  `.text-caption-italic` typography helpers.

**Acceptance**: after this step, `npm run dev` shows the same UI as
before (alias layer kicks in). `npm run build` passes.

---

## 2. Fonts — `app/layout.tsx`

**Current**: loads only Geist (sans + mono).

**Change**: replace with the three families used by the design system.

```tsx
import { Inter, Crimson_Pro, Space_Grotesk } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// In <body>:
className={twMerge(
  inter.variable,
  crimsonPro.variable,
  spaceGrotesk.variable,
  "antialiased font-sans"
)}
```

**Acceptance**: `Inter` becomes the body font globally; `font-serif` and
`font-display` classes resolve correctly.

---

## 3. Primitives — new components in `components/ui/`

Add three new files (already drafted in `reference-components/` of this
handoff — copy them directly):

### `components/ui/Suit.tsx`

The Spanish-suit pip (espada · basto · oro · copa). See the file for the
mapping rules; never use English suits.

### `components/ui/Palito.tsx`

The single-tally-mark component (`Palito` named export) plus a `Tally`
helper that stacks `Palito`s vertically. **This replaces the existing
`components/ui/TallyMarks.tsx`** — delete the old file when you wire
this up in step 5.

> The shape of a palito is a **square casita** (4 sides + diagonal),
> not five parallel lines. The traditional Uruguayan way of tallying
> truco scores. Bezier wobble in the strokes gives it a hand-drawn feel.
> See `DESIGN.md` § "Palito" for the full spec.

### `components/ui/PaperPanel.tsx`

The signature cream-paper container with notebook lines and inset
shadow. Used by:
- `TeamCounter` (hosts the Palitos)
- `Profile` hero card
- `Sidebar` user card
- `Statistics` top-1 spotlight

---

## 4. Login — `app/login/page.tsx`

**Layout**: dark background + soft radial glows (us & them) + two
decorative Spanish cards (espada and copa) tilted at ±15°, then a
narrow form panel centered.

- Wrapper: `bg-background min-h-screen relative overflow-hidden`.
- Glow layers: two `absolute` divs, `filter: blur(120px)`, opacity 0.2,
  one in top-left (`bg-us`), one in bottom-right (`bg-them`).
- Decorative cards: two `bg-paper rounded-md shadow-raised` rectangles
  ~140×200px, positioned with `transform: rotate(±15deg)`, each with a
  large number (Crimson Pro, weight 800) in opposite corners and a
  large Suit pip (size 50) centered.
- Form panel: `bg-surface rounded-2xl border border-border p-6` with
  italic Crimson Pro labels (`text-caption-italic text-text-dim`) and
  Inter input values.
- Submit button: full-width, `bg-us text-white rounded-lg py-4
  text-base font-bold`. Copy: **"Entrar a la mesa"** (es-coloquial) /
  **"Iniciar sesión"** (es).

**Replace** the existing flat dark form. The `useLogin` hook and
`<Button>` primitive stay the same — only restyle.

---

## 5. Counter — `components/MatchCounter.tsx` + `TeamCounter.tsx` + `Controls.tsx`

This is the priority screen. The current code splits malas/buenas into
two stacked boxes per team — keep that, but the visual treatment is
totally new.

### `components/TeamCounter.tsx` (full rewrite)

For each team column:

```
┌────────────────────────────────────┐
│  ♠️ Nosotros          27           │  ← Suit + label (Crimson italic)
│  BAUER · FEDE · GASTI              │  ← players overline, label-overline
│  ┌──────────────────────────────┐  │
│  │ ┌────────┐                   │  │  ← PaperPanel
│  │ │ palito │  (malas, top half)│  │
│  │ │ palito │                   │  │
│  │ ├────────┤ ← divider          │  │
│  │ │ palito │  (buenas, bottom) │  │
│  │ └────────┘                   │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

- Top row: `flex justify-between items-baseline`, Suit (size 10) +
  label (`text-heading-sm` italic, color `text-us` or `text-them`) on
  the left, big score (`text-display-xl` in `font-display` color
  matching team) on the right.
- Player names: `text-label-overline text-text-mute uppercase`.
- `PaperPanel` fills the rest of the column (`flex-1`). Inside:
  - Top region (malas): vertical stack of `Palito`s, count = malas.
  - 1px divider with color `paper-line` opacity 0.5 (only render if
    malas > 0 AND buenas > 0).
  - Bottom region (buenas): vertical stack of `Palito`s, count = buenas.
- Use the team color (`#8B5CF6` or `#34D399`) directly on the SVG
  stroke — palitos render on cream paper, so the team color stays
  vibrant.

### `components/Controls.tsx` (full rewrite)

Bottom-fixed bar, **no longer absolutely positioned at the screen
edges** — sits inside the main flex container, gap 6px from the bottom
of the team columns.

```
[ −  27  + ]    [ X ]    [ −  11  + ]
```

- Each side is a `bg-surface rounded-xl border border-border p-1.5
  flex gap-1` row containing:
  - `−` button: 42×42, `bg-transparent border border-us/40 text-us
    rounded-md` (use `them` on the right side).
  - score in the middle: `flex-1 grid place-items-center font-display
    text-display-md text-us`.
  - `+` button: 42×42, `bg-us text-white rounded-md`.
- Center exit button: 44×44 `bg-surface rounded-full text-text-dim
  border border-border`.

Hit-target minimum is **42px**. Confirm with a dev-tools tap-target audit.

### `components/MatchCounter.tsx`

Mostly mechanical:
- Wrapper: `flex flex-col min-h-screen bg-background`.
- Top status row (new): `flex justify-between px-4 pt-14` showing
  `se juega a {max}` (Crimson italic) — small logo center — menu
  button right.
- Body: `flex gap-2.5 px-3.5 flex-1` with two `<TeamCounter>` columns.
- Bottom: `<Controls>` with the new layout.

Add a `<Suit kind="espada" />` next to **Nosotros**, `<Suit kind="basto" />`
next to **Ellos**.

---

## 6. Setup — `components/MatchSetup.tsx`

Restyle without changing logic for player ↔ team membership
(`toggleUserInTeam` etc. stays), but add a new **active-team** state to
drive the interaction flow described below.

### Interaction flow

The current implementation lists every player twice (once per team
column) and toggles on tap. The redesigned screen is more compact:
each team panel shows only the **selected** players, and there's a
single shared **pool** ("en el banco") below.

To add a player you need to first **target which team** they're going
to. The flow:

1. **Resting state**: both team panels show selected chips + a dashed
   "+ sumar" button. Pool shows everyone not yet picked. Nothing in
   the pool is tappable yet (or tapping does nothing).
2. **Tap "+ sumar" on Nosotros** → that panel becomes "active":
   stronger border (`border-us`, 2px), faint `bg-us/8` fill, a 4px
   soft ring (`box-shadow: 0 0 0 4px bg-us/8`), and the "+ sumar"
   button itself changes to **"↓ tocá un jugador"**. The "en el
   banco" overline gains a suffix "*· sumando a Nosotros*" (the
   active team's name in its color).
3. **Pool chips highlight**: while a team is active, every pool chip
   tints toward that team's color (`bg-us/10`, `border-us/35`,
   `text-us`) to signal they're tappable.
4. **Tap a pool chip** → instantly added to the active team. The
   chip flies out of the pool and into the team panel. Active state
   persists so you can add several players in a row.
5. **Tap a selected chip** (inside a team panel) → removes that
   player back to the pool. The `×` glyph already implies this.
6. **Switch teams**: tap the *other* team's "+ sumar". If you tap
   the same team's "+ sumar" again, it deactivates (resting state).
7. **Tap anywhere outside both panels and the pool** → also
   deactivates. Optional but nice.
8. **Start** is enabled when both teams have equal size ≥ 2.

State to add:

```ts
const [activeTeam, setActiveTeam] = useState<1 | 2 | null>(null);
```

Visual states (use `tailwind-variants` or `twMerge`):

| Element | Resting | Active |
| --- | --- | --- |
| Team panel border | `border border-us/40` | `border-2 border-us` + `shadow-[0_0_0_4px_theme(colors.us/8)]` |
| Team panel bg | `bg-surface` | `bg-us/[0.07]` |
| "+ sumar" button | dashed `border-us/60`, italic | filled-light `bg-us/10` border-solid, copy = "↓ tocá un jugador" |
| Pool chip | `bg-surface border-border text-text` | `bg-us/10 border-us/35 text-us` |
| Pool overline | "en el banco" | "en el banco · sumando a Nosotros" (in `text-us`) |

Replace `us` with `them` for the Ellos column. The transition is
~150-200ms; use `transition-all duration-200`.

### Layout

- Two team panels side-by-side at the top (`grid grid-cols-2 gap-2.5`).
  Each: `rounded-xl p-3`. Header row: Suit (size 12) + label (Crimson
  italic 17px, team color) on left, "n/3" counter (Crimson italic
  10px, `text-text-mute`) on right.
- Selected players: chips with `bg-{team}/20 text-{team}`, 6px×10px
  padding, `rounded-sm`, with a faint `×` glyph on the right.
- "Disponibles" pool below: flex-wrap of chips. See state table.
- Score selector: 4 segmented buttons inside an `bg-surface
  rounded-xl border border-border p-3` panel. Active:
  `bg-us text-white`. Inactive: `border-border text-text`.
- CTA: full-width `bg-us text-white rounded-lg py-4 text-base
  font-bold shadow-[0_8px_20px_-10px_theme(colors.us)]`. Copy:
  **"Cortar y empezar"** (es-coloquial). Disabled until teams equal
  ≥ 2 — gray it down (`opacity-50 cursor-not-allowed`) and don't
  fire the gradient shadow.

### Accessibility

- Make the "+ sumar" button a real `<button>` with
  `aria-pressed={activeTeam === thisTeam}` and an accessible name
  like "Sumar a Nosotros".
- Pool chips become `<button>`s only when a team is active; otherwise
  they're inert. Set `aria-disabled` accordingly to keep the markup
  stable.

---

## 7. Sidebar — `components/SideDrawer.tsx`

Open from the **right** still (matches existing). Width 290px.

- Toggle button (current top-right hamburger): restyle to
  `bg-surface border border-border rounded-md size-9`.
- Drawer panel: `bg-[#111613] border-l border-border` (slightly
  warmer than `background`), padding 60/20/28.
- **Player card on top** (replaces the small name): use a horizontal
  `PaperPanel` (set `lines={false}`) with a tiny inline Spanish card
  (38×50 black rectangle with "1" + espada + rotated "1"). Right side:
  username (Crimson 700) + tagline (`text-caption-italic`).
- Nav items: `flex flex-col gap-1`. Active route gets
  `bg-us/20 text-us border border-us/40 rounded-md font-bold`.
  Inactive: `text-text font-medium hover:bg-surface`.
- Logout button at the bottom: italic Crimson Pro, color `danger`,
  border `border-danger/30 rounded-md`. Copy:
  **"levantarse de la mesa"** (es-coloquial) / **"Cerrar sesión"** (es).

---

## 8. Profile — `app/profile/page.tsx`

The card-shaped hero is the visual hook. Replace the current
`<header>` + first card with a `PaperPanel`-based "1 de espada"
spotlight.

Structure inside `<main>`:

1. **Player spotlight (PaperPanel, lines=false)**: large card with
   "1" + espada decoration in the four corners; centered content:
   - "el jugador" (`text-caption-italic` muted) / "the player" (es)
   - username (`text-heading-lg` Crimson, `text-paper-ink`)
   - horizontal rule (1px paper-ink/40, 30px wide, centered)
   - "glicko" (`text-caption-italic` muted)
   - rating (`text-display-lg` Space Grotesk, paper-ink)
   - delta this week (`text-them-deep text-xs font-bold`)
2. **Stat tiles row** (`grid grid-cols-3 gap-2`):
   - Ganadas (W) — `text-them`, `text-display-md` font-display.
   - Perdidas (L) — `text-danger`.
   - Winrate (%) — `text-text`.
   Each tile: `bg-surface border border-border rounded-lg p-3 text-center`.
3. **Elo + RD + Racha row**: single `bg-surface rounded-lg p-3
   flex justify-between divide-x divide-border`. Three columns,
   italic Crimson labels, Space Grotesk values.
4. **Últimas partidas**: section title (Crimson italic) + list of 3
   condensed match rows (see History card spec below). Right-aligned
   "ver todas →" link.

Keep `getMe` / `getUserStats` / `getMatches` calls intact.

---

## 9. Statistics — `app/statistics/page.tsx`

The current page renders Glicko and Elo tables stacked. Keep both
tables but restructure:

1. **Tab switcher** at top: `bg-surface rounded-md border border-border
   p-1 flex gap-1`. Active tab `bg-us text-white rounded-sm`, inactive
   `text-text-dim`. State is local (no URL change needed).
2. **Top-1 spotlight (PaperPanel)**: horizontal card with mini Spanish
   card on the left (50×64, `bg-paper-ink`, espada + numbers in paper),
   middle: "el de arriba" (Crimson italic muted) + name (Crimson 700)
   + "{w}W · {l}L", right: rating (Space Grotesk 30px 900) +
   "GLICKO"/"ELO" overline.
3. **Leaderboard table**: `bg-surface rounded-xl border border-border
   overflow-hidden`. Grid layout (not `<table>` — easier to control):
   `grid-cols-[28px_1fr_32px_32px_60px]`. Header row: `text-label-overline
   text-text-mute italic`. Data rows: `border-b border-border last:border-0`,
   `text-text font-medium`, W in `text-them`, L in `text-danger`,
   rating in `font-display font-extrabold`.

Highlight current user's row with `bg-us/5`.

---

## 10. History — `app/history/page.tsx` + `MatchList.tsx` + `MatchCard.tsx`

`MatchList`'s session grouping logic stays. Restyle:

- Session header: `text-caption-italic text-text-dim` (no longer
  uppercase tracked). Add a thin divider line to the right of the date
  (`flex-1 h-px bg-border`).
- `MatchCard` (full rewrite): horizontal row instead of two-column
  comparison.

```
┌────────────────────────────────────┐
│ [G]  Bauer · Fede · Gasti    35    │
│ ♠️   vs Pepe · Goncho · Oti  —28   │
│                              a 40  │
└────────────────────────────────────┘
```

- Left: 32×40 mini Spanish-card style with "G" or "P" (Crimson 800)
  and a small Suit (espada if won, basto if lost), `bg-paper-ink`,
  rounded `rounded-xs`.
- Middle: own-team names in `text-text font-semibold`, opponents
  prefixed with "vs" in `text-text-dim italic`. Truncate with ellipsis.
- Right: score in `font-display text-md font-extrabold` — winning
  score in team-of-perspective color, losing in `text-text-dim`.
  Below: "a {max}" in `text-caption-italic text-text-mute`.

Card itself: `bg-surface rounded-lg p-3 border border-border`,
shadow `shadow-card`.

Expand-on-tap (`MatchCard` already toggles `expanded`): when expanded,
slide in the per-player rating deltas below. Keep the toggle behavior.

---

## 11. Versus — `app/versus/page.tsx` (not in the prototype)

The prototype doesn't include this screen. Apply the same design
language: dark surfaces, paper accents for the head-to-head card,
Spanish suits to identify each player. Treat it as a follow-up PR.

---

## 12. Cleanup

- Remove the `primary-*` / `secondary-*` aliases from `@theme inline`.
- Replace any remaining `text-zinc-*` / `bg-zinc-*` classes with the
  semantic equivalents (`text-text`, `bg-surface`, etc.).
- Delete the old `components/ui/TallyMarks.tsx` once `Palito` is wired
  in everywhere.
- Run `npm run lint && npm run build`.

---

## Locale keys to add

Add to **both** `locales/es.json` and `locales/es-coloquial.json`.
The coloquial values are in the second column.

| Key | es | es-coloquial |
| --- | --- | --- |
| `login.button` | "Entrar" | "Entrar a la mesa" |
| `login.tagline` | "Contador · Ranking · Historial" | "tu mesa, tu marca, tu ranking" |
| `matchSetup.button.start` | "Empezar partido" | "Cortar y empezar" |
| `matchSetup.pool` | "Disponibles" | "en el banco" |
| `matchSetup.maxPoints` | "Puntaje máximo" | "se juega a..." |
| `matchCounter.team1` | "Nosotros" | "Nosotros" |
| `matchCounter.team2` | "Ellos" | "Ellos" |
| `matchCounter.playing` | "Se juega a {{max}}" | "se juega a {{max}}" |
| `sideDrawer.logout` | "Cerrar sesión" | "levantarse de la mesa" |
| `sideDrawer.home` | "Inicio" | "Armar mesa" |
| `statistics.topPlayer` | "Líder del ranking" | "el de arriba" |
| `profile.label` | "El jugador" | "el jugador" |
| `profile.recent` | "Últimas partidas" | "últimas partidas" |
| `profile.viewAll` | "Ver todas" | "ver todas" |

---

## Out of scope

- The data layer, API routes, Glicko logic.
- The `Versus` screen (not designed yet).
- Tweaks panel (only a designer convenience, doesn't ship).
- Loading skeletons (use the existing spinner, or design as a follow-up).
