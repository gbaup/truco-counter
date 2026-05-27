import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/fetchJSON";
import { Group } from "@/types/group";

interface MyGroup extends Group {
  member_count: number;
  joined_at: string | null;
}

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["groups", "me"],
    queryFn: () =>
      fetchJSON<{ success: boolean; groups: MyGroup[] }>("/api/groups/me").then(
        (r) => r.groups
      ),
  });
};
