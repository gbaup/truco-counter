"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupName } from "@/services/groupService";

export function useUpdateGroupName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
      updateGroupName(groupId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", "me"] });
    },
  });
}
