"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "@/services/adminService";
import { queryKeys } from "./queryKeys";

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
    },
  });
}
