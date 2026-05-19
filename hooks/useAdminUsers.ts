"use client";

import { useState, useCallback } from "react";
import { AdminUser } from "@/types/database";
import { listUsers } from "@/services/adminService";

export function useAdminUsers() {
    const [players, setPlayers] = useState<AdminUser[]>([]);
    const [query, setQuery] = useState("");
    const [creating, setCreating] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    const fetchPlayers = useCallback(async () => {
        const data = await listUsers();
        setPlayers(data);
    }, []);

    const filtered = players.filter(
        (p) =>
            p.username.toLowerCase().includes(query.toLowerCase()) ||
            `${p.name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase())
    );

    const updateUsername = (id: string, username: string) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, username } : p))
        );
    };

    return {
        players,
        filtered,
        query,
        setQuery,
        creating,
        setCreating,
        editingUser,
        setEditingUser,
        fetchPlayers,
        updateUsername,
    };
}
