"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";
import { queryKeys } from "./queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getUsers,
    staleTime: 2 * 60_000,
  });
}
