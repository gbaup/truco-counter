import { fetchJSON } from "@/lib/fetchJSON";
import { PublicUser, UserStats, VersusStats } from "@/types/database";

export async function updateMyUsername(
  username: string,
  targetUserId?: string
): Promise<void> {
  const url = targetUserId ? `/api/admin/users/${targetUserId}` : `/api/users/me`;
  await fetchJSON(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
}

export async function getUsers(): Promise<PublicUser[]> {
  try {
    return await fetchJSON<PublicUser[]>("/api/users");
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserStats(): Promise<UserStats[]> {
  try {
    return await fetchJSON<UserStats[]>("/api/users/stats");
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return [];
  }
}

export async function getUsersVersus(p1Id: string, p2Id: string): Promise<VersusStats | null> {
  try {
    return await fetchJSON<VersusStats>(`/api/users/versus?p1=${p1Id}&p2=${p2Id}`);
  } catch (error) {
    console.error(error);
    return null;
  }
}
