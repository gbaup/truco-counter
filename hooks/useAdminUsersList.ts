"use client";

import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/services/adminService";
import { queryKeys } from "./queryKeys";

export function useAdminUsersList(enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: listUsers,
    staleTime: 30_000,
    enabled,
  });
}
