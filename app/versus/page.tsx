"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers, getUsersVersus } from "@/services/userService";
import BurgerMenu from "@/components/BurgerMenu";
import UserDropdown from "@/components/UserDropdown";
import VersusResults from "@/components/VersusResults";

interface VersusStats {
    total_matches: number;
    p1_wins: number;
    p2_wins: number;
    draws: number;
}

export default function VersusPage() {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [player1, setPlayer1] = useState<string>("");
    const [player2, setPlayer2] = useState<string>("");
    const [stats, setStats] = useState<VersusStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    useEffect(() => {
        if (player1 && player2 && player1 !== player2) {
            setLoading(true);
            getUsersVersus(player1, player2)
                .then((data) => setStats(data))
                .catch(() => setStats(null))
                .finally(() => setLoading(false));
        } else {
            setStats(null);
        }
    }, [player1, player2]);

    return (
        <div className="flex min-h-screen flex-col items-center p-8 pt-24">
            <BurgerMenu />

            <h1 className="mb-8 text-4xl font-bold text-white">Versus</h1>

            <div className="w-full max-w-4xl grid gap-8 md:grid-cols-2">
                <UserDropdown
                    label="Jugador 1"
                    value={player1}
                    onChange={setPlayer1}
                    users={users}
                    disabledId={player2}
                    labelColorClass="text-primary-400"
                    ringColorClass="focus:ring-primary-500"
                />

                <UserDropdown
                    label="Jugador 2"
                    value={player2}
                    onChange={setPlayer2}
                    users={users}
                    disabledId={player1}
                    labelColorClass="text-secondary-400"
                    ringColorClass="focus:ring-secondary-500"
                />
            </div>

            <div className="mt-12 w-full max-w-2xl">
                <VersusResults
                    stats={stats}
                    loading={loading}
                    p1Name={users.find((u) => u.id === player1)?.username}
                    p2Name={users.find((u) => u.id === player2)?.username}
                />
            </div>
        </div>
    );
}
