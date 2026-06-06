-- Enable RLS on tables missed by the previous security migration.
-- groups, group_memberships, and invite_tokens are in the public schema and
-- were exposed to the Supabase Data API without any row-level restriction.
-- No permissive policies are defined — intentional. All data access goes through
-- Next.js API routes → Prisma (BYPASSRLS). PostgREST is not used by this app.
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;
