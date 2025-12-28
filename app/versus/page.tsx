"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers, getUsersVersus } from "@/services/userService";
import BurgerMenu from "@/components/BurgerMenu";

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
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
                    <label className="mb-2 block text-sm font-medium text-blue-400">
                        Jugador 1
                    </label>
                    <select
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        className="w-full capitalize rounded-lg bg-black/20 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar jugador</option>
                        {users.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                                disabled={user.id === player2}
                            >
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
                    <label className="mb-2 block text-sm font-medium text-red-400">
                        Jugador 2
                    </label>
                    <select
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                        className="w-full capitalize rounded-lg bg-black/20 p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Seleccionar jugador</option>
                        {users.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                                disabled={user.id === player1}
                            >
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-12 w-full max-w-2xl">
                {loading ? (
                    <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                    </div>
                ) : stats ? (
                    <div className="space-y-6 text-center animate-fade-in">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-xl bg-blue-500/20 p-4">
                                <div className="text-3xl font-bold text-blue-400">{stats.p1_wins}</div>
                                <div className="text-sm capitalize text-blue-200">Victorias {users.find(u => u.id === player1)?.username}</div>
                            </div>

                            <div className="rounded-xl bg-white/10 p-4">
                                <div className="text-3xl font-bold text-white">{stats.draws}</div>
                                <div className="text-sm text-gray-300">Empates</div>
                            </div>

                            <div className="rounded-xl bg-red-500/20 p-4">
                                <div className="text-3xl font-bold text-red-400">{stats.p2_wins}</div>
                                <div className="text-sm capitalize text-red-200">Victorias {users.find(u => u.id === player2)?.username}</div>
                            </div>
                        </div>

                        <div className="text-xl text-gray-400">
                            Total Partidos: <span className="font-bold text-white">{stats.total_matches}</span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-center text-gray-500">
                        Selecciona dos jugadores para ver el historial
                    </div>
                )}
            </div>
        </div>
    );
}
