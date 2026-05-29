"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useUserStats() {
  const { activeGroupId } = useActiveGroup();
  return useQuery({
    queryKey: queryKeys.userStats(activeGroupId ?? undefined),
    queryFn: () => getUserStats(activeGroupId ?? undefined),
    staleTime: 2 * 60_000,
  });
}
