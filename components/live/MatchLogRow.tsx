"use client";

import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";
import { Hand, Side, TimeStyle } from "@/hooks/usePointLog";
import { clockTime, timeAgo } from "@/lib/timeAgo";

/**
 * MatchLogRow — a single HAND as a row in the match log.
 *
 *   Us (left, purple) · time in the middle · Them (right, emerald)
 *
 * Shows the FULL hand: if both teams scored, both tokens are visible
 * ("1 a 1", "3 a 1"); if only one team scored, the other side shows a
 * faint dash. The net difference is never shown alone.
 *
 * `pending` = the hand in progress (debounce window open): tokens pulse,
 * the center reads "recording…", and an amber bar appears.
 */

interface MatchLogRowProps {
  hand: Pick<Hand, "us" | "them" | "ts">;
  timeStyle?: TimeStyle;
  pending?: boolean;
  last?: boolean;
}

function Token({
  side,
  n,
  pending,
  mirror,
}: {
  side: Side;
  n: number;
  pending?: boolean;
  mirror?: boolean;
}) {
  const isUs = side === "us";
  const color = isUs ? "text-us" : "text-them";
  const ring = isUs ? "border-us" : "border-them";
  const tint = isUs ? "bg-us/15" : "bg-them/15";

  if (!n) {
    return (
      <span className="px-3 text-text-mute/45 font-serif italic text-base">
        —
      </span>
    );
  }
  return (
    <div
      className={`flex items-center gap-[7px] ${mirror ? "flex-row-reverse" : ""}`}
    >
      <Suit kind={isUs ? "espada" : "basto"} size={11} className={color} />
      <div
        className={`min-w-10 h-[34px] px-[11px] grid place-items-center rounded-sm ${tint} border ${ring} ${
          pending ? "border-opacity-100 animate-pulse" : "border-opacity-40"
        } font-display font-extrabold text-base ${color}`}
      >
        +{n}
      </div>
    </div>
  );
}

export default function MatchLogRow({
  hand,
  timeStyle = "rel",
  pending = false,
  last = false,
}: MatchLogRowProps) {
  const { t } = useTranslation();
  const time =
    timeStyle === "hora" ? clockTime(hand.ts) : timeAgo(hand.ts, t);

  return (
    <div
      className={`relative flex items-center py-[11px] px-0.5 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <div className="flex-1 flex justify-start">
        <Token side="us" n={hand.us} pending={pending} />
      </div>

      <div
        className={`shrink-0 w-[86px] text-center font-serif italic text-[12.5px] ${
          pending ? "text-text" : "text-text-dim"
        }`}
      >
        {pending ? (
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            {t("relato.recording")}
          </span>
        ) : (
          time
        )}
      </div>

      <div className="flex-1 flex justify-end">
        <Token side="them" n={hand.them} pending={pending} mirror />
      </div>

      {pending && (
        <span className="pointer-events-none absolute left-0 bottom-0 h-0.5 rounded bg-warning animate-[relato-bar_2.4s_linear_infinite]" />
      )}
    </div>
  );
}
