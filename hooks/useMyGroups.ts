"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getMyGroups } from "@/services/groupService";

const PUBLIC_ROUTES = ["/login", "/register", "/join"];

export const useMyGroups = () => {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname?.startsWith(p));

  return useQuery({
    queryKey: ["groups", "me"],
    queryFn: getMyGroups,
    enabled: !isPublicRoute,
  });
};
