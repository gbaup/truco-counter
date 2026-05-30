"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { useActiveGroup } from "./useActiveGroup";

export function useUsers(groupId?: string, options?: { enabled?: boolean }) {
  const { activeGroupId } = useActiveGroup();
  const effectiveGroupId = groupId ?? activeGroupId ?? undefined;
  return useQuery({
    queryKey: queryKeys.users(effectiveGroupId),
    queryFn: () => getUsers(effectiveGroupId),
    staleTime: 2 * 60_000,
    enabled: options?.enabled !== false,
  });
}
