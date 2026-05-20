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
  highlightPlayer,
}: {
  matches: MatchHistoryItem[];
  emptyMessage: string;
  highlightPlayer?: string | null;
}) {
  if (matches.length === 0) {
    return (
      <p
        className="text-caption-italic text-text-mute px-1"
        style={{ fontFamily: "var(--font-crimson-pro), serif" }}
      >
        {emptyMessage}
      </p>
    );
  }

  const sessions = groupBySessions(matches);

  return (
    <div className="flex flex-col gap-5">
      {sessions.map((session) => (
        <div key={session.label + session.matches[0].id}>
          {/* Session header */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-caption-italic text-text-dim shrink-0"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 12 }}
            >
              {session.label}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-2">
            {session.matches.map((match) => (
              <MatchCard key={match.id} match={match} highlightPlayer={highlightPlayer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
