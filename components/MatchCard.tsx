"use client";

import { useState } from "react";
import { MatchHistoryItem } from "@/types/match";
import TeamColumn from "@/components/TeamColumn";

export default function MatchCard({ match }: { match: MatchHistoryItem }) {
    const [expanded, setExpanded] = useState(false);
    const team1 = match.match_participants.filter((p) => p.team === 1);
    const team2 = match.match_participants.filter((p) => p.team === 2);

    return (
        <div
            className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-colors active:border-zinc-600 active:bg-zinc-900"
            onClick={() => setExpanded((prev) => !prev)}
        >
            <div className="flex items-center gap-4">
                <TeamColumn
                    participants={team1}
                    score={match.score_team_1}
                    isWinner={match.winner_team === 1}
                    showRatings={expanded}
                />
                <span className="text-sm font-bold text-zinc-600">vs</span>
                <TeamColumn
                    participants={team2}
                    score={match.score_team_2}
                    isWinner={match.winner_team === 2}
                    showRatings={expanded}
                />
            </div>
        </div>
    );
}
