import Suit from "@/components/ui/Suit";

interface VersusStats {
  total_matches: number;
  p1_wins: number;
  p2_wins: number;
  draws: number;
}

interface VersusResultsProps {
  stats: VersusStats | null;
  loading: boolean;
  p1Name?: string;
  p2Name?: string;
}

export default function VersusResults({ stats, loading, p1Name, p2Name }: VersusResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-us border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p
        className="text-caption-italic text-text-mute text-center py-6"
        style={{ fontFamily: "var(--font-crimson-pro), serif" }}
      >
        Select two players to see their history
      </p>
    );
  }

  const total = stats.total_matches;
  const p1Pct = total > 0 ? Math.round((stats.p1_wins / total) * 100) : 0;
  const p2Pct = total > 0 ? Math.round((stats.p2_wins / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Head-to-head card */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {/* Player columns */}
        <div className="grid grid-cols-[1fr_40px_1fr]">
          {/* Player 1 */}
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <Suit kind="espada" size={16} color="var(--color-us)" />
            <p
              className="text-us font-bold capitalize text-center truncate w-full text-[13px] mt-0.5"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {p1Name ?? "—"}
            </p>
            <p
              className="text-us font-extrabold leading-none mt-1"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui", fontSize: 40 }}
            >
              {stats.p1_wins}
            </p>
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              wins
            </p>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center justify-center gap-1 border-x border-border">
            <span
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 10, letterSpacing: "0.1em" }}
            >
              vs
            </span>
            {stats.draws > 0 && (
              <>
                <p
                  className="font-extrabold text-text-dim text-[15px]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
                >
                  {stats.draws}
                </p>
                <p
                  className="text-caption-italic text-text-mute"
                  style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 9 }}
                >
                  tie
                </p>
              </>
            )}
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <Suit kind="basto" size={16} color="var(--color-them)" />
            <p
              className="text-them font-bold capitalize text-center truncate w-full text-[13px] mt-0.5"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {p2Name ?? "—"}
            </p>
            <p
              className="text-them font-extrabold leading-none mt-1"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui", fontSize: 40 }}
            >
              {stats.p2_wins}
            </p>
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              wins
            </p>
          </div>
        </div>

        {/* Win-rate bar */}
        {total > 0 && (
          <div className="px-4 pb-4 flex flex-col gap-1.5">
            <div className="h-1.5 rounded-full bg-border overflow-hidden flex">
              <div className="bg-us h-full rounded-full transition-all" style={{ width: `${p1Pct}%` }} />
              <div className="bg-them h-full rounded-full transition-all ml-auto" style={{ width: `${p2Pct}%` }} />
            </div>
            <div className="flex justify-between">
              <span className="text-us text-[11px] font-bold">{p1Pct}%</span>
              <span className="text-them text-[11px] font-bold">{p2Pct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <p
        className="text-caption-italic text-text-mute text-center"
        style={{ fontFamily: "var(--font-crimson-pro), serif" }}
      >
        {total} {total === 1 ? "match" : "matches"} total
      </p>
    </div>
  );
}
