import { fetchJSON } from "@/lib/fetchJSON";
import { PublicUser, UserStats, VersusStats } from "@/types/database";

export async function updateMyUsername(username: string): Promise<void> {
  await fetchJSON(`/api/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
}

export async function updateUserUsername(
  userId: string,
  username: string
): Promise<void> {
  await fetchJSON(`/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
}

export async function getUsers(groupId?: string): Promise<PublicUser[]> {
  const url = groupId ? `/api/users?groupId=${groupId}` : "/api/users";
  try {
    return await fetchJSON<PublicUser[]>(url);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserStats(groupId?: string): Promise<UserStats[]> {
  const url = groupId ? `/api/users/stats?groupId=${groupId}` : "/api/users/stats";
  try {
    return await fetchJSON<UserStats[]>(url);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return [];
  }
}

export async function getUsersVersus(p1Id: string, p2Id: string, groupId?: string): Promise<VersusStats | null> {
  const base = `/api/users/versus?p1=${p1Id}&p2=${p2Id}`;
  const url = groupId ? `${base}&groupId=${groupId}` : base;
  try {
    return await fetchJSON<VersusStats>(url);
  } catch (error) {
    console.error(error);
    return null;
  }
}
