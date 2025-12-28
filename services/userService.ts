
import { PublicUser, UserStats } from "@/types/database";

export async function getUsers(): Promise<PublicUser[]> {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserStats(): Promise<UserStats[]> {
  try {
    const response = await fetch("/api/users/stats");
    if (!response.ok) {
      throw new Error("Failed to fetch user stats");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return [];
  }
}

export async function getUsersVersus(p1Id: string, p2Id: string) {
  try {
    const response = await fetch(`/api/users/versus?p1=${p1Id}&p2=${p2Id}`);
    if (!response.ok) throw new Error("Error en el versus");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

