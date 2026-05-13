import { CreateMatchDto, UpdateMatchDto } from "@/types/match";

export async function createMatch(matchData: CreateMatchDto) {
  try {
    const response = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create match");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
}

export async function updateMatch(id: string, matchData: UpdateMatchDto) {
  try {
    const response = await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update match");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
}

export async function saveMatch(matchData: CreateMatchDto) {
  return createMatch({ ...matchData, status: "finished" });
}

export async function getMatches(userId?: string) {
  try {
    const url = userId ? `/api/matches?userId=${userId}` : "/api/matches";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch matches");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

