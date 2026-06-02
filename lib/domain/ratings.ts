export function glickoScore(rating: number | undefined, ratingDeviation: number | undefined): number {
  if (rating === undefined || ratingDeviation === undefined) return 0;
  return rating - ratingDeviation;
}

export function classicScore(wins: number, losses: number): number {
  return wins * 2 + losses;
}

export function winRate(wins: number, losses: number): number {
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
}
