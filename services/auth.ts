import { User } from "@/types/database";

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Invalid username or password",
      };
    }

    return { success: true, user: data.user };
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
