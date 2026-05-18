import { PublicUser } from "@/types/database";
import { UserRole } from "@/types/auth";

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; user?: PublicUser; error?: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
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

export async function getMe(): Promise<{ userId: string; username: string; role?: UserRole; googleLinked?: boolean } | null> {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function unlinkGoogle(): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/auth/google/unlink", { method: "POST" });
    return res.json();
  } catch {
    return { success: false };
  }
}
