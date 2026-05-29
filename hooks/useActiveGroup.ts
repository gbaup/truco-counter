"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMyGroups } from "./useMyGroups";

const COOKIE_KEY = "active-group-id";

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_KEY}=`));
  return entry ? entry.split("=").slice(1).join("=") : null;
}

function writeCookie(groupId: string) {
  document.cookie = `${COOKIE_KEY}=${groupId}; path=/; max-age=31536000; SameSite=Lax`;
}

export function useActiveGroup() {
  const queryClient = useQueryClient();
  const { data: groups = [] } = useMyGroups();

  const [storedId, setStoredId] = useState<string | null>(() => readCookie());

  const activeGroupId =
    storedId && groups.some((g) => g.id === storedId)
      ? storedId
      : (groups[0]?.id ?? null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  const setActiveGroup = useCallback(
    (groupId: string) => {
      writeCookie(groupId);
      setStoredId(groupId);
      queryClient.invalidateQueries();
    },
    [queryClient]
  );

  return { activeGroupId, activeGroup, setActiveGroup, groups };
}
