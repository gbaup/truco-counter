
import { PublicUser } from "@/types/database";

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
