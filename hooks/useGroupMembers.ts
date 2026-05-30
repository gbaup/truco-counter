"use client";

import { useQuery } from "@tanstack/react-query";
import { listGroupMembers } from "@/services/groupService";
import { queryKeys } from "./queryKeys";

export function useGroupMembers(groupId: string | null) {
  return useQuery({
    queryKey: queryKeys.groupMembers(groupId ?? ""),
    queryFn: () => listGroupMembers(groupId!),
    enabled: !!groupId,
    staleTime: 30_000,
  });
}
