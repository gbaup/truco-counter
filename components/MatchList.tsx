import { MatchHistoryItem, MatchParticipantWithUser } from "@/types/match";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-UY", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function TeamColumn({
    participants,
    score,
    isWinner,
}: {
    participants: MatchParticipantWithUser[];
    score: number;
    isWinner: boolean;
}) {
    return (
        <div className="flex flex-1 flex-col items-center gap-2">
            <div className={`text-3xl font-black ${isWinner ? "text-secondary-500" : "text-red-500"}`}>
                {score}
            </div>
            <div className="flex flex-col items-center gap-1">
                {participants.map((p) => (
                    <div key={p.user_id} className="flex items-center gap-1.5">
                        <span className="capitalize text-sm text-zinc-300">
                            {p.users.username}
                        </span>
                        {p.rating_change != null && (
                            <span className={`text-xs font-bold ${p.rating_change >= 0 ? "text-secondary-400" : "text-red-400"}`}>
                                {p.rating_change >= 0 ? `+${p.rating_change}` : p.rating_change}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MatchList({
    matches,
    emptyMessage,
}: {
    matches: MatchHistoryItem[];
    emptyMessage: string;
}) {
    if (matches.length === 0) {
        return <p className="text-center text-zinc-500">{emptyMessage}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            {matches.map((match) => {
                const team1 = match.match_participants.filter((p) => p.team === 1);
                const team2 = match.match_participants.filter((p) => p.team === 2);
                return (
                    <div
                        key={match.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
                    >
                        <div className="flex items-center gap-4">
                            <TeamColumn
                                participants={team1}
                                score={match.score_team_1}
                                isWinner={match.winner_team === 1}
                            />
                            <span className="text-sm font-bold text-zinc-600">vs</span>
                            <TeamColumn
                                participants={team2}
                                score={match.score_team_2}
                                isWinner={match.winner_team === 2}
                            />
                        </div>
                        <p className="mt-3 text-center text-xs text-zinc-600">
                            {formatDate(match.created_at)}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
