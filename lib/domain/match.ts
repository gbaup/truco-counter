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
