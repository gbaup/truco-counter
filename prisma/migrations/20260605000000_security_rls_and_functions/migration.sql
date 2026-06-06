-- Enable RLS on all public tables.
-- Prisma connects as the postgres superuser (BYPASSRLS), so app queries are unaffected.
-- This blocks unrestricted access via the Supabase PostgREST (Data API).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;

-- Recreate user_stats view with security_invoker so it respects the querying role's
-- privileges and RLS policies rather than the view creator's.
-- Also removes the stale rating columns (moved to group_memberships in an earlier migration).
DROP VIEW IF EXISTS public.user_stats;
CREATE VIEW public.user_stats WITH (security_invoker = true) AS
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

-- Fix mutable search_path on both functions to prevent search path injection.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_users_versus(player1_id uuid, player2_id uuid)
RETURNS TABLE(total_matches bigint, p1_wins bigint, p2_wins bigint, draws bigint)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT,
        COUNT(*) FILTER (WHERE m.winner_team = p1.team AND m.winner_team != p2.team)::BIGINT AS p1_wins,
        COUNT(*) FILTER (WHERE m.winner_team = p2.team AND m.winner_team != p1.team)::BIGINT AS p2_wins,
        COUNT(*) FILTER (WHERE m.winner_team IS NULL)::BIGINT AS draws
    FROM match_participants p1
    JOIN match_participants p2 ON p1.match_id = p2.match_id
    JOIN matches m ON p1.match_id = m.id
    WHERE p1.user_id = player1_id
      AND p2.user_id = player2_id
      AND p1.team != p2.team
      AND m.status = 'finished';
END;
$$;
