import { fetchJSON } from "@/lib/fetchJSON";
import { PublicUser } from "@/types/database";
import { UserRole } from "@/types/auth";

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; user?: PublicUser; error?: string }> {
  try {
    const data = await fetchJSON<{ success: boolean; user?: PublicUser }>(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      }
    );
    return { success: true, user: data.user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function register(data: {
  name: string;
  lastName: string;
  username: string;
  email?: string;
  password: string;
  inviteToken?: string;
}): Promise<{ success: boolean; user?: PublicUser; error?: string }> {
  try {
    const result = await fetchJSON<{ success: boolean; user?: PublicUser }>(
      "/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return { success: true, user: result.user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Registration failed",
    };
  }
}

export async function joinGroup(token: string): Promise<{ success: boolean; error?: string; errorCode?: string }> {
  try {
    const response = await fetch(`/api/invite/${token}/join`, { method: "POST" });
    const data = await response.json().catch(() => ({})) as { error?: string; errorCode?: string };
    if (!response.ok) {
      return { success: false, error: data.error ?? `HTTP ${response.status}`, errorCode: data.errorCode };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to join group" };
  }
}

export async function logout() {
  // cookie clearing is handled server-side via the logout route
}

export async function getMe(): Promise<{
  userId: string;
  username: string;
  role?: UserRole;
  googleLinked?: boolean;
  passwordChanged?: boolean;
} | null> {
  try {
    return await fetchJSON("/api/auth/me");
  } catch {
    return null;
  }
}

export async function unlinkGoogle(): Promise<{ success: boolean }> {
  try {
    return await fetchJSON("/api/auth/google/unlink", { method: "POST" });
  } catch {
    return { success: false };
  }
}
