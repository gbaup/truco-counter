import { useState } from "react";
import { login } from "@/services/auth";
import { toast } from "sonner";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const { success, error } = await login(username, password);
            if (!success || error) {
                toast.error(error || "Invalid credentials");
                setError(error || "Invalid credentials");
                return false;
            }
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
            setError("Something went wrong");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleLogin };
};