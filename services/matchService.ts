import { fetchJSON } from "@/lib/fetchJSON";
import { CreateMatchDto, UpdateMatchDto, MatchHistoryItem } from "@/types/match";

export function createMatch(matchData: CreateMatchDto): Promise<{ id: string }> {
  return fetchJSON<{ id: string }>("/api/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matchData),
  });
}

export function updateMatch(id: string, matchData: UpdateMatchDto) {
  return fetchJSON(`/api/matches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matchData),
  });
}

export function saveMatch(matchData: CreateMatchDto) {
  return createMatch({ ...matchData, status: "finished" });
}

export async function getMatches(userId?: string): Promise<MatchHistoryItem[]> {
  const url = userId ? `/api/matches?userId=${userId}` : "/api/matches";
  try {
    return await fetchJSON<MatchHistoryItem[]>(url);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}
