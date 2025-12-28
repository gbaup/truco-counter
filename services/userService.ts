
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

