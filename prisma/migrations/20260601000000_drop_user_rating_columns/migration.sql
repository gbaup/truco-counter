-- Recreate user_stats view without rating columns (tracked per-group in group_memberships now)
DROP VIEW IF EXISTS user_stats;
CREATE VIEW user_stats AS
SELECT
    u.id AS user_id,
    u.username,
    COUNT(mp.match_id) FILTER (
        WHERE m.status = 'finished' AND m.winner_team = mp.team
    ) AS wins,
    COUNT(mp.match_id) FILTER (
        WHERE m.status = 'finished'
            AND m.winner_team IS NOT NULL
            AND m.winner_team != mp.team
    ) AS losses
FROM users u
LEFT JOIN match_participants mp ON mp.user_id = u.id
LEFT JOIN matches m ON m.id = mp.match_id
GROUP BY u.id, u.username;

-- Drop rating columns from users (ratings are now tracked per-group in group_memberships)
ALTER TABLE "users" DROP COLUMN "rating";
ALTER TABLE "users" DROP COLUMN "rating_deviation";
ALTER TABLE "users" DROP COLUMN "elo_rating";
ALTER TABLE "users" DROP COLUMN "last_decay_at";
