"use client";

import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";
import MatchLogRow from "@/components/live/MatchLogRow";
import { Hand, TimeStyle } from "@/hooks/usePointLog";
import { useTick } from "@/lib/timeAgo";

/**
 * MatchLogSheet — bottom sheet showing the match log, hand by hand.
 *
 * Pattern = the Bottom Sheet from the design system: backdrop blur,
 * upper corners rounded-2xl, grabber. The counter dims behind it.
 *
 * The column header ("Us / hand / Them") anchors which side is which
 * team so the rows don't need to repeat team names.
 */

interface MatchLogSheetProps {
  open: boolean;
  onClose: () => void;
  hands: Hand[];
  pending?: { us: number; them: number; ts: number } | null;
  live?: boolean; // there is an ongoing match → show "live" dot
  timeStyle?: TimeStyle;
}

function ColumnHead() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center pb-2 px-0.5 border-b border-border mb-0.5">
      <div className="flex-1 flex items-center gap-1.5">
        <Suit kind="espada" size={10} className="text-us" />
        <span className="font-serif italic font-bold text-[13px] text-us">
          {t("relato.us")}
        </span>
      </div>
      <div className="shrink-0 w-[86px] text-center text-[9px] tracking-[0.14em] uppercase text-text-mute">
        {t("relato.handCol")}
      </div>
      <div className="flex-1 flex items-center justify-end gap-1.5">
        <span className="font-serif italic font-bold text-[13px] text-them">
          {t("relato.them")}
        </span>
        <Suit kind="basto" size={10} className="text-them" />
      </div>
    </div>
  );
}

export default function MatchLogSheet({
  open,
  onClose,
  hands,
  pending = null,
  live = false,
  timeStyle = "rel",
}: MatchLogSheetProps) {
  const { t } = useTranslation();
  useTick(15000);

  const empty = hands.length === 0 && !pending;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/55 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label={t("relato.ariaLabel")}
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-2xl border-t border-border bg-surface shadow-[0_-20px_40px_rgba(0,0,0,0.45)] transition-transform duration-[240ms] ease-[cubic-bezier(0.2,0.9,0.3,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "64dvh" }}
      >
        <div className="flex justify-center pt-2">
          <div className="h-1 w-9 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-[18px] pt-2 pb-2">
          <div>
            <h2 className="font-serif italic font-bold text-lg text-text">
              {t("relato.title")}
            </h2>
            <p className="mt-px text-[10.5px] tracking-[0.04em] text-text-mute">
              {t("relato.subtitle")}
            </p>
          </div>
          {live && (
            <span className="flex items-center gap-1.5 font-serif italic text-[11px] text-them">
              <span className="w-[7px] h-[7px] rounded-full bg-them animate-pulse" />
              {t("relato.live")}
            </span>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto px-[18px] pb-[18px]"
          style={{
            WebkitMaskImage: "linear-gradient(180deg,#000 92%,transparent)",
          }}
        >
          {empty ? (
            <p className="pt-10 text-center font-serif italic text-text-mute">
              {t("relato.empty")}
            </p>
          ) : (
            <>
              <ColumnHead />
              {pending && (
                <MatchLogRow hand={pending} pending timeStyle={timeStyle} />
              )}
              {hands.map((h, i) => (
                <MatchLogRow
                  key={h.id}
                  hand={h}
                  timeStyle={timeStyle}
                  last={i === hands.length - 1}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
