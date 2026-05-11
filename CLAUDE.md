# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint (Next.js + TypeScript rules)
```

A pre-push Husky hook runs `lint && build` automatically — both must pass before pushing.

After installing dependencies, `prisma generate` runs automatically via `postinstall`. To run it manually:

```bash
npx prisma generate
npx prisma migrate dev   # Apply pending migrations
```

## Environment

Required variables (copy to `.env.local`):

```
DATABASE_URL=       # PostgreSQL connection string
JWT_SECRET=         # Secret for HS256 JWT signing
NEXT_PUBLIC_APP_LANG=  # es | es-coloquial
```

A `docker-compose.yaml` is present at the root but contains unrelated services (n8n, evolution-api). Use a Supabase project or a standalone PostgreSQL instance for local development.

## Architecture

**Full-stack Next.js 16 app** (App Router) for scoring Uruguayan Truco card games. TypeScript throughout.

### Data flow

```
React components
  → useMatch / useLogin hooks  (local state + localStorage)
  → /services/ (typed fetch wrappers)
  → /app/api/ routes           (JWT auth via jose, HttpOnly cookies)
  → Prisma ORM  →  PostgreSQL
```

### Key layers

| Layer | Location | Notes |
|---|---|---|
| Pages & layouts | `app/` | App Router; main views: setup, counter, stats, versus |
| Hooks | `hooks/` | `useMatch.ts` owns game state; persists to localStorage and syncs with API |
| API routes | `app/api/` | `/auth/login`, `/auth/logout`, `/matches`, `/matches/[id]`, `/users`, `/users/stats`, `/users/versus` |
| Services | `services/` | Thin fetch wrappers consumed by hooks and pages |
| DB schema | `prisma/schema.prisma` | Three tables: `users`, `matches`, `match_participants` |
| Prisma client | `lib/generated/prisma/` | Generated path (not `node_modules`) — configured in `prisma.config.ts` |
| i18n | `locales/` | `es.json` (formal) and `es-coloquial.json` (Rioplatense colloquial) |
| Types | `types/` | `game.ts`, `match.ts`, `database.ts`, `auth.ts` |

### Auth

JWT tokens (HS256, 1-day TTL) are issued on login and stored in HttpOnly cookies. All mutating API routes verify the token server-side before proceeding.

### Localization

The language is selected at runtime via `NEXT_PUBLIC_APP_LANG`. `I18nProvider.tsx` wraps the app and loads the correct locale file. All user-facing strings must go through `react-i18next` — add keys to **both** locale files when adding new copy.

### Styling

Tailwind CSS v4. Shared variants and class merging use `tailwind-variants` + `tailwind-merge` + `clsx`. Reusable primitives live under `components/ui/`.

---

## Game rules

- **Format:** 2v2 or 3v3. Teams are ad-hoc — players mix between matches.
- **Match length:** played to 30, 40, or 50 points.
  - First half of the target is called **"malas"**, second half **"buenas"**. This is display-only — no gameplay difference.
- **Result stored:** winning team, losing team, final score, and match timestamp.
- **No seasons:** ranking is a single continuous historical record.

---

## Player ranking

Individual ratings use the **Glicko system** (see the `glicko-ranking` skill).
Before writing any ranking-related code, read that skill for the full algorithm and data model.

### Configuration for this project

| Parameter     | Value     | Reason                                      |
|---------------|-----------|---------------------------------------------|
| `r0`          | 1500      | Conventional baseline                       |
| `RD0`         | 350       | Maximum uncertainty for new players         |
| `RD_min`      | 50        | Floor — prevents over-stabilization         |
| `c`           | 15        | RD growth per global match missed           |
| Result type   | Binary    | Win = 1, Loss = 0. Score margin is ignored. |
| Team strength | `average` | Equal contribution across teammates         |
| Inactivity    | Match-based | N = finished matches played globally since player's last finished match. |

### Inactivity decay

Applied once before processing each new result for a player, based on how many finished matches have occurred globally since their last participation:

```
N   = COUNT of matches WHERE status = 'finished'
          AND created_at > player's last finished match created_at
RD  = min( sqrt(RD² + (c² * N)) , RD0 )
```

Only `status = 'finished'` matches count — incomplete or abandoned matches are ignored. Since `matches.id` is a UUID, ordering relies on `created_at`.

### Key behaviors

- A player who missed many recent sessions will have a higher RD and move the rating of their opponents less.
- Winning against strong/confident opponents (low RD, high r) gives more points than winning against uncertain ones.
- New players settle into their true level quickly due to high initial RD.