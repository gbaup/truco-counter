"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getMyGroups } from "@/services/groupService";
import { queryKeys } from "./queryKeys";

const PUBLIC_ROUTES = ["/login", "/register", "/join"];

export const useMyGroups = () => {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname === p || pathname?.startsWith(p + "/"));

  return useQuery({
    queryKey: queryKeys.myGroups,
    queryFn: getMyGroups,
    enabled: !isPublicRoute,
  });
};
