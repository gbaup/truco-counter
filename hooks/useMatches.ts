"use client";

import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@/services/matchService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useMatches(userId?: string, options?: { enabled?: boolean; groupId?: string }) {
  const { activeGroupId } = useActiveGroup();
  const effectiveGroupId = options?.groupId ?? activeGroupId ?? undefined;
  return useQuery({
    queryKey: queryKeys.matches(userId, effectiveGroupId),
    queryFn: () => getMatches(userId, effectiveGroupId),
    staleTime: 60_000,
    ...(options?.enabled !== undefined && { enabled: options.enabled }),
  });
}
