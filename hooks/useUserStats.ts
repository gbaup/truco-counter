"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useUserStats(groupId?: string) {
  const { activeGroupId } = useActiveGroup();
  const effectiveGroupId = groupId ?? activeGroupId ?? undefined;
  return useQuery({
    queryKey: queryKeys.userStats(effectiveGroupId),
    queryFn: () => getUserStats(effectiveGroupId),
    staleTime: 2 * 60_000,
  });
}
