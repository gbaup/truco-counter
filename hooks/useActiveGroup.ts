"use client";

import { useCallback } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useMyGroups } from "./useMyGroups";
import { getGroupChangeKeys } from "./queryKeys";

const COOKIE_KEY = "active-group-id";
const ACTIVE_GROUP_QUERY_KEY = ["ui", "active-group"] as const;

const activeGroupCookie = {
  read(): string | null {
    if (typeof document === "undefined") return null;
    const entry = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_KEY}=`));
    return entry ? entry.split("=").slice(1).join("=") : null;
  },
  write(groupId: string) {
    document.cookie = `${COOKIE_KEY}=${groupId}; path=/; max-age=31536000; SameSite=Lax`;
  },
  clear() {
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
  },
};

export function useActiveGroup() {
  const queryClient = useQueryClient();
  const { data: groups = [], isPending: isGroupsPending, isSuccess: isGroupsSuccess } = useMyGroups();

  // Shared across all instances via query cache — setQueryData updates all simultaneously
  const { data: storedId = null } = useQuery({
    queryKey: ACTIVE_GROUP_QUERY_KEY,
    queryFn: () => activeGroupCookie.read(),
    initialData: activeGroupCookie.read(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const activeGroupId =
    storedId && groups.some((g) => g.id === storedId)
      ? storedId
      : (groups[0]?.id ?? null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  const isFreePlay = isGroupsSuccess && groups.length === 0;

  const setActiveGroup = useCallback(
    (groupId: string) => {
      activeGroupCookie.write(groupId);
      queryClient.setQueryData(ACTIVE_GROUP_QUERY_KEY, groupId);
      for (const key of getGroupChangeKeys()) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
    [queryClient]
  );

  return { activeGroupId, activeGroup, setActiveGroup, groups, isFreePlay, isGroupsPending };
}
