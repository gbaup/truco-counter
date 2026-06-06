# Release PR

Generate a standardized release PR from `develop` into `main`.

## Step 1 — Gather context

Run these commands in parallel:

```bash
git log main..HEAD --oneline
git diff main...HEAD --stat
git diff main...HEAD -- .env.local .env.example
gh pr list --base main --state merged --limit 10 --json title,mergedAt \
  | jq 'sort_by(.mergedAt) | reverse | .[].title'
```

## Step 2 — Determine version bump

Parse the highest version from merged release PR titles (format: `Release vX.Y` or `Release vX.Y.Z`).

Apply semver to propose the next version:

| Change type | Bump | Example |
|---|---|---|
| Complete redesign, new design system, breaking DB migrations, new auth paradigm | **Major** `X+1.0` | v2.0 → v3.0 |
| New features: pages, endpoints, game mechanics, significant UI additions | **Minor** `x.Y+1` | v2.0 → v2.1 |
| Bug fixes, small tweaks, config changes, single dependency updates | **Patch** `x.y.Z+1` | v2.1 → v2.1.1 |

Notes:
- Two-part versions (`v2.0`) only grow to three parts for patches: `v2.0.1`
- Major and minor bumps stay two-part: `v3.0`, `v2.1`

**Present the version suggestion with a one-line justification. Wait for confirmation before continuing.**

## Step 2b — Detect new env variables

Scan the diff output from Step 1 (`.env.local`, `.env.example`, and any changes that introduce new `process.env.*` references) for newly added environment variables.

If any are found, carry them into Step 5 — they will appear as a deployment reminder block in the PR body.

## Step 3 — Group changes into sections

Cluster commits and changed files into logical `###` headings. Use the same style as past releases:

- "Mesa Design System", "Glicko Ranking System", "User Roles", "Match History", "Database & Auth", "Tooling & Quality", etc.
- Drop headings with zero items
- Write bullets in past tense, verb-first: "Added X", "Fixed Y", "Replaced Z"

## Step 4 — Write the test plan

Produce a `- [ ]` checklist covering:
- Main user flows affected by the changes
- Any DB migration or new env variable
- Auth + cookie behaviour if touched
- Mobile and desktop rendering if UI changed
- Locale switching if i18n strings were added

## Step 5 — Emit the PR

### Title format

```
🚀 Release vX.Y[.Z] — <tagline listing 2–3 key themes, max 60 chars>
```

- Separate themes with `, ` and `&` before the last one
- No period at the end
- Examples:
  - `Release v2.1 — Statistics filters & match export`
  - `Release v2.0.1 — Glicko sync fix & mobile layout`

### Body format

```markdown
## Release vX.Y[.Z] — Truco Counter

<One sentence describing the scope of the release.>

---

## What's new

### <Section>
- <Bullet>

---

## Deployment

<Only include this section when new env variables were detected. List each var and end with the reminder blockquote.>

> ⚠️ **New env variables** — set these on the deployment environment before deploying:
> - `VAR_NAME` — description

---

## Test plan
- [ ] <Scenario>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Rules:
- Use `## What's new`, not `## New Features`
- `###` headings are Title Case
- One-sentence summary paragraph — no more
- Bullets: capital first letter, no trailing period, one line each

## Step 6 — Offer to open the PR

After presenting the title and body, ask: _"Want me to open this PR now with `gh pr create`?"_

Do not push or create the PR without explicit confirmation.

## Step 7 — Release notes para el grupo

After Step 6 (whether or not the PR was opened), generate informal release notes in Uruguayan Spanish to share with the friend group.

**First, read `.claude/skills/talk-as-uruguayan/SKILL.md`.** That skill governs the voice — voseo, sin signos de apertura, sin em dash, vocabulario uruguayo auténtico. Apply it throughout this step.

### Voice rules

- **No metáforas de truco**: nada de "tiramos flor" o "envido ganado". Sonar natural es más importante que forzar el chiste.
- **Pensado para el grupo**: tiene que entenderlo alguien que no sabe nada de código; cero términos técnicos

### Format

```
🆕 *Truco Counter vX.Y[.Z]*

<Una oración de intro contando de qué va la actualización, en tono de mensaje al grupo.>
Ejemplo de registro: "Ta, actualicé la app con un par de cosas nuevas."

- <Cambio principal, y si no es obvio agregá: para qué sirve en una frase>
- <Segundo cambio, ídem>
- <Tercer cambio si corresponde>
```

Rules:
- Intro: una sola oración, tono de "ta, actualicé la app"
- Bullets: 2–4 ítems, solo los cambios que le importan al usuario final; ignorar refactors, tooling y fixes internos
- Bullets obvios van en una línea; los que necesitan contexto llevan una coma y el beneficio al final
- No bullets técnicos: nada de "migración de base de datos", "nueva variable de entorno", etc.
- Emojis permitidos pero sin exagerar, uno por bullet máximo, solo si suma
- **No em dash (—) en ningún lugar del texto**, ni en la intro ni en los bullets. Usar coma o punto.

### Output

Present the release notes block as a fenced markdown block, ready to copy-paste into WhatsApp.

## Step 8 — Feedback al skill

After presenting the release notes, ask: _"Algo que cambiarías? Si me decís, lo aprendo para la próxima."_

If the user gives any feedback — whether they describe a problem, paste an edited version, or suggest a word change — apply all corrections, not just the first one. For each correction:

1. **Understand the signal.** Is it a word that sounds wrong, a tone that's too formal/informal, a structural issue (bullet too long, emoji misused), a punctuation habit?
2. **Re-read `.claude/skills/talk-as-uruguayan/SKILL.md`** to find the section that governs the issue — locate it by meaning, not by a hardcoded section name. The skill may have evolved.
3. **Apply the change** to the most appropriate place: add a word to avoid, sharpen a tone rule, add a punctuation note, add an example, etc.
4. **Confirm specifically:** _"Ta, aprendido: [qué cambió y en qué sección del skill]."_ One line per correction.

If the user says everything is fine or gives no corrections, skip this step silently.
