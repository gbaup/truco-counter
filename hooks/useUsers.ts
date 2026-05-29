"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useUsers() {
  const { activeGroupId } = useActiveGroup();
  return useQuery({
    queryKey: queryKeys.users(activeGroupId ?? undefined),
    queryFn: () => getUsers(activeGroupId ?? undefined),
    staleTime: 2 * 60_000,
  });
}
