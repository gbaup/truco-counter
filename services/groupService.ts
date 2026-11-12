import { fetchJSON } from "@/lib/fetchJSON";
import { Group, GroupMember, InviteToken } from "@/types/group";

interface GroupWithMemberCount extends Group {
  member_count: number;
  joined_at: string | null;
}

export async function createGroup(name: string): Promise<{ success: boolean; group?: Group; error?: string }> {
  try {
    const result = await fetchJSON<{ success: boolean; group: Group }>("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return { success: true, group: result.group };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create group" };
  }
}

export async function getMyGroups(): Promise<GroupWithMemberCount[]> {
  const result = await fetchJSON<{ success: boolean; groups: GroupWithMemberCount[] }>("/api/groups/me");
  return result.groups;
}

export async function generateInvite(
  groupId: string
): Promise<{ token: InviteToken; joinUrl: string }> {
  const result = await fetchJSON<{ success: boolean; token: InviteToken; joinUrl: string }>(
    `/api/groups/${groupId}/invite`,
    { method: "POST" }
  );
  return { token: result.token, joinUrl: result.joinUrl };
}

export async function revokeInvite(groupId: string, tokenId: string): Promise<void> {
  await fetchJSON(`/api/groups/${groupId}/invite/${tokenId}`, { method: "DELETE" });
}

export async function getShareLink(groupId: string): Promise<{ token: string; joinUrl: string }> {
  const result = await fetchJSON<{ success: boolean; token: string; joinUrl: string }>(
    `/api/groups/${groupId}/share-link`
  );
  return { token: result.token, joinUrl: result.joinUrl };
}

export async function listGroupMembers(groupId: string, all = false): Promise<GroupMember[]> {
  const qs = all ? "?all=true" : "";
  const result = await fetchJSON<{ success: boolean; members: GroupMember[] }>(
    `/api/groups/${groupId}/members${qs}`
  );
  return result.members;
}

export async function updateGroupName(groupId: string, name: string): Promise<Group> {
  const result = await fetchJSON<{ success: boolean; group: Group }>(
    `/api/groups/${groupId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }
  );
  return result.group;
}

export async function createGroupPlayer(
  groupId: string,
  input: { firstName: string; lastName: string; username: string }
): Promise<void> {
  const response = await fetch(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      error?: string;
      field?: string;
      code?: string;
    };
    const err = new Error(errorData.error || `HTTP ${response.status}`) as Error & {
      field?: string;
      code?: string;
    };
    if (errorData.field) err.field = errorData.field;
    if (errorData.code) err.code = errorData.code;
    throw err;
  }
}
