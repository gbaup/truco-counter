export const ELO_K = 32;
export const ELO_DEFAULT = 1200;

function expected(rating: number, opponentAvg: number): number {
    return 1 / (1 + Math.pow(10, (opponentAvg - rating) / 400));
}

export function teamAvgElo(ratings: number[]): number {
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

export function updateElo(rating: number, opponentTeamAvg: number, score: 0 | 1): number {
    return rating + ELO_K * (score - expected(rating, opponentTeamAvg));
}
