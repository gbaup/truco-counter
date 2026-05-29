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

export async function getMatches(userId?: string, groupId?: string): Promise<MatchHistoryItem[]> {
  const params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  if (groupId) params.set("groupId", groupId);
  const query = params.toString();
  const url = query ? `/api/matches?${query}` : "/api/matches";
  try {
    return await fetchJSON<MatchHistoryItem[]>(url);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}
