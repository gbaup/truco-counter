"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupPlayer } from "@/services/groupService";
import { queryKeys } from "./queryKeys";

type CreatePlayerInput = { firstName: string; lastName: string; username: string };

export function useCreatePlayer(groupId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlayerInput) => {
      if (!groupId) throw new Error("No group selected");
      return createGroupPlayer(groupId, input);
    },
    onSuccess: () => {
      if (groupId) queryClient.invalidateQueries({ queryKey: queryKeys.groupMembers(groupId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myGroups });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
