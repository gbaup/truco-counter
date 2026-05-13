"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import SideDrawer from "@/components/SideDrawer";
import MatchList from "@/components/MatchList";
import { getMe } from "@/services/auth";
import { getUserStats } from "@/services/userService";
import { getMatches } from "@/services/matchService";
import { UserStats } from "@/types/database";
import { MatchHistoryItem } from "@/types/match";

export default function ProfilePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function fetchData() {
            const me = await getMe();
            if (!me) {
                router.replace("/login");
                return;
            }
            setUsername(me.username);

            const [allStats, userMatches] = await Promise.all([
                getUserStats(),
                getMatches(me.userId),
            ]);

            const myStats = allStats.find((s) => s.user_id === me.userId) ?? null;
            setStats(myStats);
            setMatches(userMatches);
            setLoading(false);
        }
        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    const winRate =
        stats && stats.wins + stats.losses > 0
            ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
            : 0;

    return (
        <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-4 pt-16 transition-colors">
            <SideDrawer />
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-black tracking-tighter text-white md:text-7xl">
                    TRUCO<span className="text-primary-600">PRO</span>
                </h1>
            </header>
            <main className="w-full max-w-lg space-y-6">
                {/* Stats card */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
                    <h2 className="mb-1 text-2xl font-black capitalize text-white">{username}</h2>
                    {stats ? (
                        <>
                            <div className="mt-4 flex justify-between text-sm text-zinc-400">
                                <span>{t("profile.rating")} <span className="text-zinc-600">Glicko</span></span>
                                <span className="font-bold text-white">{Math.round(stats.rating)}</span>
                            </div>
                            <div className="mt-2 flex justify-between text-sm text-zinc-400">
                                <span>{t("profile.rd")}</span>
                                <span className="font-bold text-white">{Math.round(stats.rating_deviation)}</span>
                            </div>
                            <div className="mt-2 flex justify-between text-sm text-zinc-400">
                                <span>{t("profile.rating")} <span className="text-zinc-600">Elo</span></span>
                                <span className="font-bold text-white">{Math.round(stats.elo_rating)}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-xl bg-zinc-800 p-3">
                                    <p className="text-xs text-zinc-400">{t("profile.wins")}</p>
                                    <p className="text-xl font-black text-secondary-500">{stats.wins}</p>
                                </div>
                                <div className="rounded-xl bg-zinc-800 p-3">
                                    <p className="text-xs text-zinc-400">{t("profile.losses")}</p>
                                    <p className="text-xl font-black text-red-500">{stats.losses}</p>
                                </div>
                                <div className="rounded-xl bg-zinc-800 p-3">
                                    <p className="text-xs text-zinc-400">{t("profile.winRate")}</p>
                                    <p className="text-xl font-black text-white">{winRate}%</p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Match history */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        {t("matchHistory.title")}
                    </h2>
                    <MatchList matches={matches} emptyMessage={t("profile.noMatches")} />
                </div>
            </main>
        </div>
    );
}
