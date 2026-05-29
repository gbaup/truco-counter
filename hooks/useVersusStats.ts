"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsersVersus } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useVersusStats(p1: string, p2: string) {
  const { activeGroupId } = useActiveGroup();
  return useQuery({
    queryKey: queryKeys.versusStats(p1, p2, activeGroupId ?? undefined),
    queryFn: () => getUsersVersus(p1, p2, activeGroupId ?? undefined),
    enabled: !!p1 && !!p2 && p1 !== p2,
    staleTime: 60_000,
  });
}
