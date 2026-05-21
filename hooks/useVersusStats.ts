"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsersVersus } from "@/services/userService";
import { queryKeys } from "./queryKeys";

export function useVersusStats(p1: string, p2: string) {
  return useQuery({
    queryKey: queryKeys.versusStats(p1, p2),
    queryFn: () => getUsersVersus(p1, p2),
    enabled: !!p1 && !!p2 && p1 !== p2,
    staleTime: 60_000,
  });
}
