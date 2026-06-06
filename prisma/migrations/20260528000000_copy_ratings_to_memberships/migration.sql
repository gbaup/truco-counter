-- Copy existing user ratings into group_memberships for all current members.
-- This seeds per-group ratings from the global baseline so existing matches
-- remain reflected in each group's leaderboard.
UPDATE group_memberships gm
SET
    rating          = u.rating,
    rating_deviation = u.rating_deviation,
    elo_rating      = u.elo_rating,
    last_decay_at   = u.last_decay_at
FROM users u
WHERE gm.user_id = u.id;
