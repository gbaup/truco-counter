import { LiveMatchData, Hand } from "@/types/match";

type OngoingMatchRow = {
  id: string;
  score_team_1: number | null;
  score_team_2: number | null;
  max_points: number | null;
  users: { name: string | null; username: string } | null;
  match_participants: Array<{
    team: number | null;
    users: { name: string | null; username: string } | null;
  }>;
};

export function formatLivePayload(
  match: OngoingMatchRow | null,
  hands: Hand[] = []
): { live: LiveMatchData | null } {
  if (!match) return { live: null };

  const teamUs = match.match_participants
    .filter((p) => p.team === 1)
    .map((p) => p.users?.name ?? p.users?.username ?? "?");

  const teamThem = match.match_participants
    .filter((p) => p.team === 2)
    .map((p) => p.users?.name ?? p.users?.username ?? "?");

  return {
    live: {
      matchId: match.id,
      scoreUs: match.score_team_1 ?? 0,
      scoreThem: match.score_team_2 ?? 0,
      max: match.max_points ?? 30,
      teamUs,
      teamThem,
      scorer: match.users?.name ?? match.users?.username ?? "?",
      scorerUsername: match.users?.username ?? "?",
      hands,
    },
  };
}

export function formatTeamNames(
  participants: Array<{ team: number; users: { username: string } | null }>,
  team: number
): string {
  return participants
    .filter((p) => p.team === team)
    .map((p) => p.users?.username)
    .filter((u): u is string => !!u)
    .join(" · ");
}

export function isTransitioningToFinished(
    currentStatus: string | null,
    newStatus: string
): boolean {
    return newStatus === "finished" && currentStatus !== "finished";
}
