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
