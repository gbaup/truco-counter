---
name: glicko-ranking
description: >
  Implements a Glicko-based individual rating system for any competitive
  app where players or teams compete and results are tracked. Use this skill
  whenever you need to design, implement, explain, or debug a player ranking
  system. Triggers on any mention of: ranking, rating, leaderboard, Elo,
  Glicko, skill rating, matchmaking, player score, win/loss tracking, or
  competitive balance. Works for 1v1, team vs team (any size), or mixed
  formats. Always consult this skill before writing any rating-related code
  or database schema.
---

# Glicko Ranking System

Glicko is an evolution of Elo. It adds a second value per player — **Rating
Deviation (RD)** — that tracks how uncertain the system is about their true
skill level. This removes the need for a hand-tuned K-factor and handles
inactivity naturally.

---

## Core concepts

Each player (or entity being ranked) has exactly two values:

```
r   = rating  (estimated skill level)
RD  = Rating Deviation  (uncertainty about that estimate)
```

**Intuition for RD:**

| RD    | Meaning                                               |
|-------|-------------------------------------------------------|
| ~350  | New player — no information about their level yet     |
| ~100  | Active player — rating is reliable                    |
| ~50   | Very active player — rating is highly reliable        |
| Rises | Inactive player — the system "forgets" their level    |

Key properties:
- RD **decreases** after every match (we learned something)
- RD **increases** with inactivity (we become less sure)
- A win/loss against a high-RD opponent moves your rating less (they're uncertain)

---

## System constants

```
r0     = 1500   # initial rating for new players (conventional, can be changed)
RD0    = 350    # initial RD — maximum uncertainty
RD_min = 50     # floor — RD never goes below this
c      = 15     # inactivity growth rate (tune based on expected play frequency)
q      = ln(10) / 400  ≈ 0.005756
```

### Tuning `c`

`c` controls how fast RD grows when a player is inactive.

| Play frequency     | Suggested `c` |
|--------------------|---------------|
| Daily              | 5 – 10        |
| Weekly             | 10 – 20       |
| Monthly or casual  | 20 – 35       |

---

## Algorithm

### Step 1 — Apply inactivity decay

Before processing a match, update RD for each participating player to account
for time since their last match:

```
RD = min( sqrt(RD² + c²) , RD0 )
```

**Per-match mode** (no timestamps): apply once per match played.

**Time-based mode** (with timestamps): apply N times, where:
```
N = floor( days_since_last_match / base_period_days )
```

### Step 2 — Compute expected outcome

```
g(RD) = 1 / sqrt( 1 + 3 * q² * RD² / π² )

E = 1 / ( 1 + 10^( g(RD_opponent) * (r_opponent - r_player) / 400 ) )
```

`g(RD)` dampens the influence of opponents with high uncertainty.

### Step 3 — Update rating and RD

```
d² = 1 / ( q² * g(RD_opponent)² * E * (1 - E) )

r'  = r  + ( q / (1/RD² + 1/d²) ) * g(RD_opponent) * (S - E)
RD' = sqrt( 1 / (1/RD² + 1/d²) )
RD' = max( RD', RD_min )
```

Where `S` is the outcome for the player: `1` = win, `0` = loss, `0.5` = draw.

---

## Team matches

When players compete in teams (e.g. 2v2, 3v3), compute a single
representative value for each team, then apply the algorithm as if it were
1v1 between teams. Each individual player on the team updates using the
opposing team's aggregate values.

```
r_team  = aggregate( r  of each member )   # see options below
RD_team = aggregate( RD of each member )   # same function
```

**Aggregation options:**

| Function    | When to use                                              |
|-------------|----------------------------------------------------------|
| `average`   | Default — contribution is roughly equal across players   |
| `sum`       | When team size varies and larger teams should be stronger |
| `weighted`  | When some roles contribute more than others              |

Use the **same aggregation function** for both `r` and `RD`.

Then in Steps 2 and 3, substitute:
- `r_opponent` → `r_opponent_team`
- `RD_opponent` → `RD_opponent_team`

Each player updates their own `(r, RD)` individually using the shared team
expected outcome `E`.

---

## Result types

| Outcome     | S value |
|-------------|---------|
| Win         | 1       |
| Loss        | 0       |
| Draw        | 0.5     |
| Partial win | 0 – 1   |

For binary-only games (no draws), use only `S = 1` or `S = 0`.

---

## Data model (minimum fields)

### Player / ranked entity

```
player:
  id
  r               # current rating
  RD              # current uncertainty
  last_match      # timestamp or match index (for inactivity calculation)
```

### Match record

```
match:
  id
  timestamp
  participants:   [ { player_id, team_id, score: S } ]
```

For team matches, group participants by `team_id`.

---

## Operation order (recording a match)

1. Load current `(r, RD)` for all participants
2. Apply inactivity decay — Step 1 — to each player
3. Compute team aggregates (if team match)
4. Compute expected outcome `E` — Step 2 — for each player
5. Compute updated `(r', RD')` — Step 3 — for each player
6. Persist new values

---

## Displaying ratings

- Show `r` as a rounded integer
- Optionally show `r ± RD` as a confidence interval
- Sort leaderboards by `r` descending
- Consider hiding or marking players with high RD (e.g. `RD > 200`) as
  "unranked" or "provisional" since their rating is still unreliable

---

## Parameter tuning reference

| Parameter | Increase effect            | Decrease effect             | Default |
|-----------|----------------------------|-----------------------------|---------|
| `c`       | Inactivity penalizes more  | Inactivity penalizes less   | 15      |
| `RD_min`  | More long-term stability   | Ratings stay more volatile  | 50      |
| `RD0`     | New players start more uncertain | New players settle faster | 350  |
| `r0`      | Changes baseline only      | Changes baseline only       | 1500    |