"use client";

import { useState } from "react";
import { AdminUser } from "@/types/database";
import { useAdminUsersList } from "./useAdminUsersList";

export function useAdminUsers() {
  const { data: players = [], error, isPending: isLoading } = useAdminUsersList();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filtered = players.filter(
    (p) =>
      p.username.toLowerCase().includes(query.toLowerCase()) ||
      `${p.name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase())
  );

  return {
    players,
    filtered,
    query,
    setQuery,
    creating,
    setCreating,
    editingUser,
    setEditingUser,
    isLoading,
    error,
  };
}
