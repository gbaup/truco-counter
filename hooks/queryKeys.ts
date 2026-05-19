export const queryKeys = {
  currentUser: ["currentUser"] as const,
  users: ["users"] as const,
  userStats: ["userStats"] as const,
  adminUsers: ["adminUsers"] as const,
  matches: (userId?: string) =>
    userId ? (["matches", userId] as const) : (["matches"] as const),
  versusStats: (p1: string, p2: string) => ["versusStats", p1, p2] as const,
};
