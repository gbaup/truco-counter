"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserUsername } from "@/services/userService";
import { queryKeys } from "./queryKeys";

export function useUpdateUserUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, username }: { userId: string; username: string }) =>
      updateUserUsername(userId, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupMembers.all });
    },
  });
}
