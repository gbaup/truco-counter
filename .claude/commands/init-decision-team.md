---
description: Start a structured decision-making session. Asks for the decision, then hands off to the decision-lead agent.
argument-hint: [optional decision in one sentence]
---

You are kicking off a structured decision-making session using the decision-team (decision-lead + devops-architect + product-strategist + skills: find-local-skill, brainstorming, grill-me, judgment-day).

User input to this command: $ARGUMENTS

## What to do

**If `$ARGUMENTS` above contains a decision (non-empty / non-whitespace):** skip the opening question and hand off immediately. Output exactly this line, with no preamble and no analysis:

Use the decision-lead agent. $ARGUMENTS

**If `$ARGUMENTS` is empty:** ask one focused opening question. Use this exact wording, with no greeting before it and no additional content after:

> Welcome to the decision team. What decision are you working on? Give me one or two sentences — the trade-off you're weighing, the question on the table, or what you're trying to figure out.

Then stop. Wait for the user's reply. Do not analyze, do not propose options, do not invoke any agent yet.

**When the user replies** (their next message in this session), immediately hand off to the decision-lead. Output exactly this line, with no preamble:

Use the decision-lead agent. <paste the user's reply verbatim>

## Rules

- Do not analyze the decision yourself in this command — your only jobs here are (a) capture the framing and (b) hand off
- Do not paraphrase, summarize, or condense the user's reply — pass it verbatim, in their own words, so the decision-lead works from the user's framing not a rewrite of it
- Do not invoke `devops-architect` or `product-strategist` directly — those are the decision-lead's calls to make, not this command's
- If the user's reply is a clarifying question about the process (e.g., "what does this team do?") rather than a decision, answer in one sentence and re-ask the opening question
- If the user replies with something off-topic or unrelated to a decision, ask once more for a decision; if still off-topic, hand off anyway and let the decision-lead figure out how to frame it
