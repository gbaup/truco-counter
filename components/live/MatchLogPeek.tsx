"use client";

import { useTranslation } from "react-i18next";
import { Hand, TimeStyle } from "@/hooks/usePointLog";
import { clockTime, timeAgo, useTick } from "@/lib/timeAgo";

/**
 * MatchLogPeek — a subtle bar above the controls showing the last hand
 * (both sides) that opens the match log when tapped.
 *
 * Sits inside MatchCounter, positioned above <Controls/>.
 * Renders nothing if there are no hands yet.
 */

interface MatchLogPeekProps {
  lastHand: Hand | null;
  onOpen: () => void;
  timeStyle?: TimeStyle;
}

export default function MatchLogPeek({
  lastHand,
  onOpen,
  timeStyle = "rel",
}: MatchLogPeekProps) {
  const { t } = useTranslation();
  useTick(15000);
  if (!lastHand) return null;

  const time =
    timeStyle === "hora" ? clockTime(lastHand.ts) : timeAgo(lastHand.ts, t);

  return (
    <button
      onClick={onOpen}
      aria-label={t("relato.openAriaLabel")}
      className="flex w-full items-center gap-[9px] rounded-[13px] border border-border bg-surface/95 px-3 py-[9px] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] backdrop-blur active:scale-[0.99] transition-transform"
    >
      <span className="flex min-w-0 flex-1 items-center gap-[7px] text-left">
        {lastHand.us > 0 && (
          <span className="font-display font-extrabold text-sm text-us">
            +{lastHand.us}{" "}
            <span className="font-serif font-normal not-italic text-xs italic">
              {t("relato.usAbbr")}
            </span>
          </span>
        )}
        {lastHand.us > 0 && lastHand.them > 0 && (
          <span className="text-text-mute">·</span>
        )}
        {lastHand.them > 0 && (
          <span className="font-display font-extrabold text-sm text-them">
            +{lastHand.them}{" "}
            <span className="font-serif font-normal text-xs italic">{t("relato.them")}</span>
          </span>
        )}
        <span className="font-serif italic text-xs text-text-dim">
          · {time}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-[3px] font-serif italic text-[11px] text-text-mute">
        {t("relato.openButton")}
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </span>
    </button>
  );
}
