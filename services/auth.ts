import { supabase } from "@/lib/supabase";
import { User } from "@/types/database";
import bcrypt from "bcryptjs";

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return { success: false, error: "Invalid username or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" };
    }

    return { success: true, user: user };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function logout() {
  // Logic handled in client/middleware usually for cookie clearing,
  // but if we used server actions we'd do it here.
  // For this client-side first approach, we might just delete the cookie in the route or component.
}
