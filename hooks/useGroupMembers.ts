"use client";

import { useQuery } from "@tanstack/react-query";
import { listGroupMembers } from "@/services/groupService";
import { queryKeys } from "./queryKeys";

export function useGroupMembers(groupId: string | null, all = false) {
  return useQuery({
    queryKey: queryKeys.groupMembers(groupId ?? ""),
    queryFn: () => listGroupMembers(groupId!, all),
    enabled: !!groupId,
    staleTime: 30_000,
  });
}
