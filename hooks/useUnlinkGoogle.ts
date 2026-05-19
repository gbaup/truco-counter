"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlinkGoogle } from "@/services/auth";
import { queryKeys } from "./queryKeys";

export function useUnlinkGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlinkGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}
