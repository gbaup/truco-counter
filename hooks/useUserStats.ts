"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/userService";
import { queryKeys } from "./queryKeys";

export function useUserStats() {
  return useQuery({
    queryKey: queryKeys.userStats,
    queryFn: getUserStats,
    staleTime: 2 * 60_000,
  });
}
