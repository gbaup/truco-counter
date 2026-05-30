"use client";

import { UserRole } from "@/types/auth";
import { AdminUser } from "@/types/database";
import { useAdminUsersList } from "./useAdminUsersList";
import { useGroupMembers } from "./useGroupMembers";

function matchesSearch(user: AdminUser, query: string): boolean {
  const q = query.toLowerCase();
  return (
    user.username.toLowerCase().includes(q) ||
    `${user.name} ${user.last_name}`.toLowerCase().includes(q)
  );
}

export function useAdminDisplayList(
  selectedGroupId: string | null,
  searchQuery: string,
  showSystemUsers: boolean
) {
  const { data: groupMembers = [], isPending: membersLoading } =
    useGroupMembers(selectedGroupId);
  const { data: players = [], isPending: playersLoading } =
    useAdminUsersList(showSystemUsers);

  const raw: AdminUser[] = selectedGroupId
    ? groupMembers.map((m) => ({
        id: m.id,
        name: m.name,
        last_name: m.last_name,
        username: m.username,
        rating: m.rating,
        rating_deviation: m.rating_deviation,
        role: "user" as UserRole,
      }))
    : players;

  const list = searchQuery ? raw.filter((u) => matchesSearch(u, searchQuery)) : raw;

  return {
    list,
    total: raw.length,
    isLoading: selectedGroupId ? membersLoading : playersLoading,
  };
}
