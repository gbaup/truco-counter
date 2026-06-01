import { MatchState, TeamId, TeamSide } from "@/types/game";

export function splitScore(
  score: number,
  max: number
): { malas: number; buenas: number } {
  const half = max / 2;
  return { malas: Math.min(score, half), buenas: Math.max(0, score - half) };
}

export function resolveWinner(
  matchState: MatchState
): { team: TeamSide; names: string[] } | null {
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

export function determineWinner(
  score1: number,
  score2: number,
  maxPoints: number
): TeamId | null {
  if (score1 >= maxPoints) return 1;
  if (score2 >= maxPoints) return 2;
  return null;
}
