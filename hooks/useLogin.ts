import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { toast } from "sonner";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
  });

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await mutation.mutateAsync({ username, password });
      if (!result.success || result.error) {
        toast.error(result.error || "Invalid credentials");
        return false;
      }
      return true;
    } catch {
      toast.error("Something went wrong");
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    handleLogin,
  };
};
