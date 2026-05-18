import { twMerge } from "tailwind-merge";
import { MatchParticipantWithUser } from "@/types/match";

export default function TeamColumn({
    participants,
    score,
    isWinner,
    showRatings = false,
}: {
    participants: MatchParticipantWithUser[];
    score: number;
    isWinner: boolean;
    showRatings?: boolean;
}) {
    return (
        <div className="flex flex-1 flex-col items-center gap-2">
            <div className={twMerge(
                "text-3xl font-black",
                isWinner ? "text-secondary-500" : "text-red-500"
            )}>
                {score}
            </div>
            <div className="flex flex-col items-center gap-1">
                {participants.map((p, i) => (
                    <div key={p.user_id ?? i} className="flex items-center gap-1.5">
                        <span className="capitalize text-sm text-zinc-300">
                            {p.users?.username ?? "—"}
                        </span>
                        {showRatings && p.rating_change != null && (
                            <span className={twMerge(
                                "text-xs font-bold",
                                p.rating_change >= 0 ? "text-secondary-400" : "text-red-400"
                            )}>
                                {p.rating_change >= 0 ? `+${p.rating_change}` : p.rating_change}
                            </span>
                        )}
                        {showRatings && p.elo_rating_change != null && (
                            <span className={twMerge(
                                "text-xs",
                                p.elo_rating_change >= 0 ? "text-secondary-600" : "text-red-700"
                            )}>
                                {p.elo_rating_change >= 0 ? `+${p.elo_rating_change}` : p.elo_rating_change}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
