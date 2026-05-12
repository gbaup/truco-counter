export const GLICKO = {
  r0: 1500,
  RD0: 350,
  RD_min: 50,
  c: 15,
  q: Math.log(10) / 400,
} as const;

export interface PlayerRating {
  r: number;
  RD: number;
}

export function gRD(RD: number): number {
  return 1 / Math.sqrt(1 + (3 * GLICKO.q ** 2 * RD ** 2) / Math.PI ** 2);
}

export function expectedScore(r: number, rOpp: number, RDOpp: number): number {
  return 1 / (1 + Math.pow(10, (gRD(RDOpp) * (rOpp - r)) / 400));
}

export function applyDecay(RD: number, missedMatches: number): number {
  if (missedMatches <= 0) return RD;
  return Math.min(Math.sqrt(RD ** 2 + GLICKO.c ** 2 * missedMatches), GLICKO.RD0);
}

export function updateRating(
  player: PlayerRating,
  opponent: PlayerRating,
  S: 0 | 1,
): PlayerRating {
  const g = gRD(opponent.RD);
  const E = expectedScore(player.r, opponent.r, opponent.RD);
  const dSquared = 1 / (GLICKO.q ** 2 * g ** 2 * E * (1 - E));
  const r = player.r + (GLICKO.q / (1 / player.RD ** 2 + 1 / dSquared)) * g * (S - E);
  const RD = Math.max(
    Math.sqrt(1 / (1 / player.RD ** 2 + 1 / dSquared)),
    GLICKO.RD_min,
  );
  return { r, RD };
}

export function teamAggregate(members: PlayerRating[]): PlayerRating {
  return {
    r: members.reduce((sum, m) => sum + m.r, 0) / members.length,
    RD: members.reduce((sum, m) => sum + m.RD, 0) / members.length,
  };
}
