"use client";

import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@/services/matchService";
import { queryKeys } from "./queryKeys";

export function useMatches(userId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.matches(userId),
    queryFn: () => getMatches(userId),
    staleTime: 60_000,
    ...(options?.enabled !== undefined && { enabled: options.enabled }),
  });
}
