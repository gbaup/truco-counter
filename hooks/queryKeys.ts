export const queryKeys = {
  currentUser: ["currentUser"] as const,
  users: (groupId?: string) =>
    groupId ? (["users", groupId] as const) : (["users"] as const),
  userStats: (groupId?: string) =>
    groupId ? (["userStats", groupId] as const) : (["userStats"] as const),
  adminUsers: ["adminUsers"] as const,
  matches: (userId?: string, groupId?: string) => {
    const key: string[] = ["matches"];
    if (userId) key.push(userId);
    if (groupId) key.push(groupId);
    return key;
  },
  versusStats: (p1: string, p2: string, groupId?: string) =>
    groupId
      ? (["versusStats", p1, p2, groupId] as const)
      : (["versusStats", p1, p2] as const),
};
