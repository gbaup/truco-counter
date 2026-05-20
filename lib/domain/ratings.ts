export function glickoScore(rating: number, ratingDeviation: number): number {
  return rating - ratingDeviation;
}

export function classicScore(wins: number, losses: number): number {
  return wins * 2 + losses;
}

export function winRate(wins: number, losses: number): number {
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
}
