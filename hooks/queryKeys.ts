export const queryKeys = {
  currentUser: ["currentUser"] as const,
  users: Object.assign(
    (groupId?: string) =>
      groupId ? (["users", groupId] as const) : (["users"] as const),
    { all: ["users"] as const }
  ),
  userStats: Object.assign(
    (groupId?: string) =>
      groupId ? (["userStats", groupId] as const) : (["userStats"] as const),
    { all: ["userStats"] as const }
  ),
  adminUsers: ["adminUsers"] as const,
  matches: Object.assign(
    (userId?: string, groupId?: string) => {
      const key: string[] = ["matches"];
      if (userId) key.push(userId);
      if (groupId) key.push(groupId);
      return key;
    },
    { all: ["matches"] as const }
  ),
  versusStats: Object.assign(
    (p1: string, p2: string, groupId?: string) =>
      groupId
        ? (["versusStats", p1, p2, groupId] as const)
        : (["versusStats", p1, p2] as const),
    { all: ["versusStats"] as const }
  ),
  groupMembers: Object.assign(
    (groupId: string) => ["groupMembers", groupId] as const,
    { all: ["groupMembers"] as const }
  ),
};
