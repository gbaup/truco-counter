import { useQuery } from "@tanstack/react-query";
import { getMyGroups } from "@/services/groupService";

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["groups", "me"],
    queryFn: getMyGroups,
  });
};
