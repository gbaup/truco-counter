
import { PublicUser } from "@/types/database";

export interface MatchResult {
  team1: PublicUser[];
  team2: PublicUser[];
  score1: number;
  score2: number;
  winner_team: 1 | 2;
}

export async function saveMatch(matchData: MatchResult) {
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
      throw new Error(errorData.error || "Failed to save match");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving match:", error);
    throw error;
  }
}

export async function getMatches() {
  try {
    const response = await fetch("/api/matches");
    if (!response.ok) {
      throw new Error("Failed to fetch matches");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}
