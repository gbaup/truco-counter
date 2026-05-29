import { useMutation } from "@tanstack/react-query";
import { createGroup as createGroupRequest } from "@/services/groupService";
import { Group } from "@/types/group";
import { toast } from "sonner";

export const useCreateGroup = () => {
  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const result = await createGroupRequest(name);
      if (!result.success || !result.group) {
        throw new Error(result.error ?? "Failed to create group");
      }
      return result.group;
    },
  });

  const createGroup = async (name: string): Promise<Group | null> => {
    try {
      return await mutation.mutateAsync(name);
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
