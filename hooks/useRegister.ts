import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth";
import { toast } from "sonner";

interface RegisterData {
  name: string;
  lastName: string;
  username: string;
  email?: string;
  password: string;
}

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: (data: RegisterData) => register(data),
  });

  const handleRegister = async (data: RegisterData): Promise<boolean> => {
    try {
      const result = await mutation.mutateAsync(data);
      if (!result.success || result.error) {
        toast.error(result.error || "Registration failed");
        return false;
      }
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    handleRegister,
  };
};
