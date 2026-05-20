"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { MatchHistoryItem } from "@/types/match";

export default function MatchCard({ match }: { match: MatchHistoryItem }) {
  const [expanded, setExpanded] = useState(false);

  const won = match.winner_team === 1;
  const decided = match.winner_team !== null;

  const team1 = match.match_participants.filter((p) => p.team === 1);
  const team2 = match.match_participants.filter((p) => p.team === 2);

  const team1Names = team1.map((p) => p.users?.username).filter(Boolean).join(" · ");
  const team2Names = team2.map((p) => p.users?.username).filter(Boolean).join(" · ");

  const winScore = won ? match.score_team_1 : match.score_team_2;
  const loseScore = won ? match.score_team_2 : match.score_team_1;

  return (
    <div
      className="bg-surface rounded-lg border border-border shadow-card p-3 flex items-start gap-3 cursor-pointer active:bg-surface-elevated transition-colors"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Team names */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
        <p className="text-text font-semibold text-[13px] capitalize truncate">{team1Names || "—"}</p>
        <p
          className="text-caption-italic text-text-dim capitalize truncate"
          style={{ fontSize: 12 }}
        >
          VS {team2Names || "—"}
        </p>

        {/* Rating deltas (expanded) */}
        {expanded && (
          <div className="mt-2 flex flex-col gap-1">
            {match.match_participants.map((p, i) => {
              if (p.rating_change == null && p.elo_rating_change == null) return null;
              return (
                <div key={p.user_id ?? i} className="flex items-center gap-1.5">
                  <span className="text-text-mute text-[11px] capitalize truncate">
                    {p.users?.username ?? "—"}
                  </span>
                  {p.rating_change != null && (
                    <span
                      className={twMerge(
                        "text-[11px] font-bold",
                        p.rating_change >= 0 ? "text-them" : "text-danger",
                      )}
                    >
                      {p.rating_change >= 0 ? `+${Math.round(p.rating_change)}` : Math.round(p.rating_change)}
                    </span>
                  )}
                  {p.elo_rating_change != null && (
                    <span
                      className={twMerge(
                        "text-[11px]",
                        p.elo_rating_change >= 0 ? "text-them/70" : "text-danger/70",
                      )}
                    >
                      elo {p.elo_rating_change >= 0 ? `+${Math.round(p.elo_rating_change)}` : Math.round(p.elo_rating_change)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Score */}
      <div className="shrink-0 text-right flex flex-col gap-1 py-0.5">
        <p
          className={twMerge(
            "font-extrabold text-[17px] leading-none",
            decided ? "text-them" : "text-text",
          )}
          style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
        >
          {decided ? winScore : match.score_team_1}
        </p>
        <p
          className="font-extrabold text-[17px] leading-none text-text-dim mt-0.5"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
        >
          {decided ? loseScore : match.score_team_2}
        </p>
      </div>
    </div>
  );
}
