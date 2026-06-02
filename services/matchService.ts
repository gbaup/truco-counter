import { fetchJSON } from "@/lib/fetchJSON";
import { CreateMatchDto, UpdateMatchDto, MatchHistoryItem, Hand } from "@/types/match";

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

export function postLiveHand(groupId: string, matchId: string, hand: Hand): Promise<void> {
  return fetchJSON(`/api/groups/${groupId}/live/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "append", matchId, hand }),
  });
}

export function clearLiveLog(groupId: string, matchId: string): Promise<void> {
  return fetchJSON(`/api/groups/${groupId}/live/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clear", matchId }),
  });
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
