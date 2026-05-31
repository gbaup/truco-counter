# Review PR Comments

Fetch all review comments on a feature PR, present them in caveman-review format, then launch two parallel adversarial judges on the PR diff to validate human findings and surface issues reviewers missed.

## Usage

`/review-comments [PR_NUMBER]`

- If `PR_NUMBER` is provided, use that PR directly
- If omitted, detect the open PR for the current branch

---

## Step 1 — Identify the PR

If `$ARGUMENTS` contains a number, use it as `PR_NUMBER`.

Otherwise, run:

```bash
gh pr view --json number,title,headRefName,baseRefName
```

Confirm the PR targets `develop`. If it targets a different base, note it and continue anyway.

Resolve the repo slug for later API calls:

```bash
gh repo view --json owner,name | jq -r '"\(.owner.login)/\(.name)"'
```

---

## Step 2 — Fetch comments and diff in parallel

Launch these three calls simultaneously:

```bash
# Inline review comments (file + line level)
gh api repos/{OWNER_REPO}/pulls/{PR_NUMBER}/comments --paginate \
  | jq '[.[] | {
      id,
      path,
      line: (.line // .original_line),
      body,
      user: .user.login,
      resolved: false,
      created_at
    }]'
```

```bash
# Top-level review summaries
gh api repos/{OWNER_REPO}/pulls/{PR_NUMBER}/reviews --paginate \
  | jq '[.[] | {id, state, body, user: .user.login, submitted_at}]'
```

```bash
# Full PR diff for adversarial review
gh pr diff {PR_NUMBER}
```

---

## Step 3 — Triage human comments by severity

Classify each comment into one of:

| Emoji | Type | When |
|---|---|---|
| 🔴 | `bug` | Broken behavior — will cause an incident |
| 🟡 | `risk` | Works but fragile — race, missing null check, swallowed error |
| 🔵 | `nit` | Style, naming, micro-optimization — author can ignore |
| ❓ | `q` | Genuine question, not a suggestion |

If the comment already contains a severity marker (e.g. from Copilot), honor it. Otherwise infer from the content.

Skip pure approval comments (`LGTM`, `Approved`, no body) — don't list those.

---

## Step 4 — Present human comments in caveman-review format

Print a header:

```
PR #<N> — <title>
<N> comment(s) · Reviewers: <comma-separated list>
```

Then list comments grouped by severity, highest first (🔴 → 🟡 → 🔵 → ❓):

```
<file>:L<line>: <emoji> <type>: <problem>. <fix>.
```

Rules:
- One line per finding
- Use exact file path and line number
- Use backticks around symbol/function/variable names
- Include the *why* if the fix isn't obvious from the problem statement
- For security findings or architectural disagreements: write a full paragraph, then resume terse
- Collapse duplicates that point at the same issue
- Mark already-resolved comments with ~~strikethrough~~ and list them at the end

---

## Step 5 — Launch two parallel adversarial judges

After presenting human comments, launch **Judge A and Judge B simultaneously** (async, never sequential). Neither judge knows the other exists. The orchestrator (you) never reviews code itself — only coordinates and synthesizes.

### Judge Prompt (identical for both)

```
You are an adversarial code reviewer. Your ONLY job is to find problems in this diff.

## Target
PR diff:

<paste full gh pr diff output here>

## Review Criteria
- Correctness: Does the code do what it claims? Logic errors, wrong conditions, off-by-ones?
- Edge cases: Unhandled inputs, states, or async scenarios?
- Error handling: Are errors caught, propagated, and surfaced — not silently swallowed?
- Performance: N+1 queries, unnecessary re-renders, repeated expensive work?
- Security: Injection risks, exposed secrets, missing auth/authz checks?
- Naming & conventions: Does it follow the project's established patterns?
- Regressions: Does any changed code silently break existing behavior?

## Output Format — MANDATORY

Use caveman-review format. One line per finding:

<file>:L<line>: <severity> <problem>. <fix>.

Severity prefixes:
- 🔴 bug: — broken behavior, will cause incident
- 🟡 risk: — works but fragile (race, null, swallowed error)
- 🔵 nit: — style, naming, micro-optim (author can ignore)
- ❓ q: — genuine question, not a suggestion

Rules:
- No hedging ("maybe", "perhaps", "I think") — use ❓ q: if unsure
- No praise, no "looks good overall"
- No restating what the code does — reviewer can read the diff
- Exact file paths and line numbers from the diff
- CVE-class security bugs: break terse mode, write a full paragraph with context, then resume terse

If you find NO issues, return exactly:
VERDICT: CLEAN — No issues found.
```

---

## Step 6 — Synthesize judge findings with human comments

After both judges return, compare all three sources (human comments, Judge A, Judge B):

```
CONFIRMED   → flagged by BOTH judges AND matches a human comment  → highest priority
AI-ONLY     → flagged by BOTH judges, NOT in human comments       → humans missed this
HUMAN+AI    → flagged by one judge AND matches a human comment    → moderate confidence
HUMAN-ONLY  → in human comments, NOT flagged by either judge      → may still be valid; show but label
SUSPECT     → flagged by ONLY ONE judge, NOT in human comments    → flag for triage
```

Print a second header:

```
## Adversarial Review — Judge Synthesis
```

Then a verdict table:

```markdown
| Finding | File | Human | Judge A | Judge B | Severity | Status |
|---------|------|-------|---------|---------|----------|--------|
| null deref on `user` | auth.ts:L42 | ✅ | ✅ | ✅ | 🔴 bug | CONFIRMED |
| no retry on 429 | api.ts:L88 | ❌ | ✅ | ✅ | 🟡 risk | AI-ONLY |
| `tmp` naming | useMatch.ts:L15 | ✅ | ❌ | ✅ | 🔵 nit | HUMAN+AI |
| unused import | api.ts:L3 | ✅ | ❌ | ❌ | 🔵 nit | HUMAN-ONLY |
| missing await | db.ts:L77 | ❌ | ✅ | ❌ | 🟡 risk | SUSPECT (A only) |
```

Rules:
- Sort by severity (🔴 → 🟡 → 🔵), then by status priority (CONFIRMED → AI-ONLY → HUMAN+AI → HUMAN-ONLY → SUSPECT)
- SUSPECT findings (only one judge, no human comment) are listed but labeled — user decides
- Collapse findings that point at the same file:line with similar descriptions

---

## Step 7 — Final summary

End with:

```
### Summary
Human: X 🔴  Y 🟡  Z 🔵  W ❓
AI-detected (missed by reviewers): A 🔴  B 🟡  C 🔵

CONFIRMED: N  ·  AI-ONLY: N  ·  HUMAN-ONLY: N  ·  SUSPECT: N

Overall: <needs changes / mostly clean / LGTM>
```

If judges both return `VERDICT: CLEAN` and human comments are all nits: print `JUDGMENT: APPROVED ✅` instead.
