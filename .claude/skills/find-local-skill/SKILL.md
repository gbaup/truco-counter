---
name: find-skill
description: Use this skill at the start of any product or engineering decision-making session to identify which locally-installed skills are relevant and assemble a playbook. Scans the .claude/skills/ directory, reads each skill's frontmatter description, and returns an ordered sequence of skills to apply to the current decision context. Trigger whenever the user is framing a new decision, says "what skills do we have for this", asks how to structure a decision-making session, or starts a workflow that might use brainstorming, grill-me, judgment-day, or any other locally-installed analysis skill. Use proactively as the first step of any decision-lead workflow.
---

# Find Skill

A meta-skill that surveys locally-installed skills and recommends which to apply, in what order, for a given decision.

## When invoked

You will be given (or you will infer from context) a decision the user is facing. Your job is to return a playbook — an ordered list of skills to apply at each stage.

## Step 1: Inventory the skill shelf

Use Glob and Read to list and inspect available skills:

1. `Glob` pattern: `.claude/skills/*/SKILL.md` (project-level skills)
2. `Glob` pattern: `~/.claude/skills/*/SKILL.md` (user-level skills)
3. For each match, read only the YAML frontmatter — specifically the `name` and `description` fields. Do **not** read the full body.

Build a mental table: skill name → one-line summary of when it triggers.

## Step 2: Classify the decision

Decide which stages this specific decision needs, in this order:

| Stage | Purpose | Typical skill type |
|---|---|---|
| Diverge | Generate options when the path forward is unclear | brainstorming, lateral-thinking, options-tree |
| Specialize | Apply domain lenses (infra, product, security, etc.) | delegated to specialist sub-agents, not skills |
| Stress-test | Adversarially attack the leading option | grill-me, red-team, premortem |
| Evaluate | Apply explicit decision criteria to finalists | judgment-day, decision-matrix, criteria-weighted |
| Commit | Frame the chosen path for execution | often no skill — just synthesis |

Not every decision needs every stage. A reversible, low-stakes decision may need only Diverge + Commit. A high-stakes, irreversible one usually needs every stage.

Calibrate stakes by asking:
- **Reversibility** — can we undo this in a week? a quarter? never?
- **Blast radius** — who/what does it affect if wrong?
- **Cost of delay** — what does it cost to take an extra week deciding?

## Step 3: Match skills to stages

For each stage the decision needs:

1. Look at the skill descriptions you inventoried
2. Pick the best fit. If no installed skill fits a stage, mark the stage as "no skill installed — handle in conversation"
3. If multiple skills fit a stage, pick one and note the alternative

## Step 4: Return the playbook

Output format:

```
Decision: [one-sentence restatement]
Stakes: [low / medium / high] — [reversible / irreversible]

Recommended playbook:
1. [stage] → [skill name OR "handle in conversation"] — [why this stage matters for this decision]
2. ...

Skills found but not used: [list, with one-line reason each]
Stages with no matching skill: [list]
Suggested specialist agents: [devops-architect, product-strategist, etc., based on decision content]
```

After returning the playbook, hand control back to the parent. The parent (typically `decision-lead`) will propose the first step and wait for user approval.

## What to avoid

- Don't invent skills that aren't in the directory
- Don't read the full body of each skill — only the frontmatter
- Don't recommend a skill just because it exists; if no stage needs it, leave it out
- Don't execute any skill yourself — your job is only to recommend the ordering
