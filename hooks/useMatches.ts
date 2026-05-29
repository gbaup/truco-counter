"use client";

import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@/services/matchService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useMatches(userId?: string, options?: { enabled?: boolean }) {
  const { activeGroupId } = useActiveGroup();
  return useQuery({
    queryKey: queryKeys.matches(userId, activeGroupId ?? undefined),
    queryFn: () => getMatches(userId, activeGroupId ?? undefined),
    staleTime: 60_000,
    ...(options?.enabled !== undefined && { enabled: options.enabled }),
  });
}
