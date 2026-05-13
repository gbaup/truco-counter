import { MatchHistoryItem } from "@/types/match";
import MatchCard from "@/components/MatchCard";

const SESSION_GAP_MS = 12 * 60 * 60 * 1000;

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-UY", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function groupBySessions(matches: MatchHistoryItem[]): { label: string; matches: MatchHistoryItem[] }[] {
    if (matches.length === 0) return [];

    // API returns DESC; reverse to process oldest-first so the first match opens each session
    const asc = [...matches].reverse();
    const groups: { start: number; label: string; matches: MatchHistoryItem[] }[] = [];

    for (const match of asc) {
        const t = new Date(match.created_at).getTime();
        const last = groups[groups.length - 1];
        if (!last || t - last.start > SESSION_GAP_MS) {
            groups.push({ start: t, label: formatDate(match.created_at), matches: [match] });
        } else {
            last.matches.push(match);
        }
    }

    // Newest session first; within each session, newest match first
    return groups.reverse().map((g) => ({ label: g.label, matches: g.matches.reverse() }));
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

    const sessions = groupBySessions(matches);

    return (
        <div className="flex flex-col gap-6">
            {sessions.map((session) => (
                <div key={session.label + session.matches[0].id}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                        {session.label}
                    </p>
                    <div className="flex flex-col gap-3">
                        {session.matches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
