# Review PR Comments

Fetch and triage all review comments on a feature PR targeting `develop`, then present them in caveman-review format.

## Usage

`/review-comments [PR_NUMBER]`

- If `PR_NUMBER` is provided, use that PR directly
- If omitted, detect the open PR for the current branch

## Step 1 — Identify the PR

If `$ARGUMENTS` contains a number, use it as `PR_NUMBER`.

Otherwise, run:

```bash
gh pr view --json number,title,headRefName,baseRefName
```

Confirm the PR targets `develop`. If it targets a different base, note it and continue anyway.

## Step 2 — Fetch all review comments

First resolve the repo slug:

```bash
gh repo view --json owner,name | jq -r '"\(.owner.login)/\(.name)"'
```

Then run in parallel:

```bash
# Inline review comments (file + line level)
gh api repos/{OWNER_REPO}/pulls/{PR_NUMBER}/comments --paginate \
  | jq '[.[] | {
      id,
      path,
      line: (.line // .original_line),
      body,
      user: .user.login,
      resolved: (if .in_reply_to_id then true else false end),
      created_at
    }]'

# Top-level review summaries
gh api repos/{OWNER_REPO}/pulls/{PR_NUMBER}/reviews --paginate \
  | jq '[.[] | {id, state, body, user: .user.login, submitted_at}]'
```

## Step 3 — Triage by severity

Classify each comment into one of:

| Emoji | Type | When |
|---|---|---|
| 🔴 | `bug` | Broken behavior — will cause an incident |
| 🟡 | `risk` | Works but fragile — race, missing null check, swallowed error |
| 🔵 | `nit` | Style, naming, micro-optimization — author can ignore |
| ❓ | `q` | Genuine question, not a suggestion |

If the comment already contains a severity marker (e.g. from Copilot), honor it. Otherwise infer from the content.

Skip pure approval comments (`LGTM`, `Approved`, no body) — don't list those.

## Step 4 — Present in caveman-review format

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

## Step 5 — Summary line

End with:

```
Total: X 🔴  Y 🟡  Z 🔵  W ❓ — <overall verdict: needs changes / mostly clean / LGTM>
```
