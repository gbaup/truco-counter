CREATE OR REPLACE VIEW user_stats AS
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
  ) AS losses,
  u.rating,
  u.rating_deviation,
  u.elo_rating
FROM users u
LEFT JOIN match_participants mp ON mp.user_id = u.id
LEFT JOIN matches m ON m.id = mp.match_id
GROUP BY u.id, u.username, u.rating, u.rating_deviation, u.elo_rating;
