"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SideDrawer from "@/components/SideDrawer";
import MatchList from "@/components/MatchList";
import { getMatches } from "@/services/matchService";
import { MatchHistoryItem } from "@/types/match";

export default function HistoryPage() {
    const { t } = useTranslation();
    const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMatches().then((data) => {
            setMatches(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-4 pt-16 transition-colors">
            <SideDrawer />
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-black tracking-tighter text-white md:text-7xl">
                    TRUCO<span className="text-primary-600">PRO</span>
                </h1>
            </header>
            <main className="w-full max-w-lg">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        {t("matchHistory.title")}
                    </h2>
                    <MatchList matches={matches} emptyMessage={t("matchHistory.noMatches")} />
                </div>
            </main>
        </div>
    );
}
