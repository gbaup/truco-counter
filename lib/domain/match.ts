import { MatchState } from "@/types/game";
import { LiveMatchData } from "@/types/match";

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

export function splitScore(
  score: number,
  max: number
): { malas: number; buenas: number } {
  const half = max / 2;
  return { malas: Math.min(score, half), buenas: Math.max(0, score - half) };
}

export function resolveWinner(
  matchState: MatchState
): { team: "us" | "them"; names: string[] } | null {
  if (matchState.score1 >= matchState.maxPoints) {
    return {
      team: "us",
      names: matchState.team1.map((u) => u.name ?? u.username),
    };
  }
  if (matchState.score2 >= matchState.maxPoints) {
    return {
      team: "them",
      names: matchState.team2.map((u) => u.name ?? u.username),
    };
  }
  return null;
}

export function formatLivePayload(
  match: OngoingMatchRow | null
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

export function determineWinner(
    score1: number,
    score2: number,
    maxPoints: number
): 1 | 2 | null {
    if (score1 >= maxPoints) return 1;
    if (score2 >= maxPoints) return 2;
    return null;
}

export function isTransitioningToFinished(
    currentStatus: string | null,
    newStatus: string
): boolean {
    return newStatus === "finished" && currentStatus !== "finished";
}
