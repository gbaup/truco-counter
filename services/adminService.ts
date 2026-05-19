import { fetchJSON } from "@/lib/fetchJSON";
import { AdminUser } from "@/types/database";

export async function listUsers(): Promise<AdminUser[]> {
  try {
    return await fetchJSON<AdminUser[]>("/api/admin/users");
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}

export async function createPlayer(input: {
  firstName: string;
  lastName: string;
  username: string;
}): Promise<void> {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      error?: string;
      field?: string;
    };
    const err = new Error(
      errorData.error || `HTTP ${response.status}`
    ) as Error & { field?: string };
    if (errorData.field) err.field = errorData.field;
    throw err;
  }
}
