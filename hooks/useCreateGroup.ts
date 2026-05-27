import { useMutation } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/fetchJSON";
import { Group } from "@/types/group";
import { toast } from "sonner";

export const useCreateGroup = () => {
  const mutation = useMutation({
    mutationFn: (name: string) =>
      fetchJSON<{ success: boolean; group: Group }>("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
  });

  const createGroup = async (name: string): Promise<Group | null> => {
    try {
      const result = await mutation.mutateAsync(name);
      return result.group;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear el grupo");
      return null;
    }
  };

  return {
    isLoading: mutation.isPending,
    createGroup,
  };
};
