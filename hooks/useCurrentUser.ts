"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth";
import { queryKeys } from "./queryKeys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getMe,
    staleTime: 5 * 60_000,
  });
}
