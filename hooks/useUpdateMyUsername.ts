"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyUsername } from "@/services/userService";
import { queryKeys } from "./queryKeys";
import { getMe } from "@/services/auth";

type CurrentUser = Awaited<ReturnType<typeof getMe>>;

export function useUpdateMyUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => updateMyUsername(username),
    onSuccess: (_, username) => {
      queryClient.setQueryData<CurrentUser>(queryKeys.currentUser, (old) => {
        if (!old) return old;
        return { ...old, username };
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats() });
    },
  });
}
