"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import BottomSheet from "@/components/ui/BottomSheet";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export interface RosterEntry {
  username: string;
  matchCount: number;
}

interface PlayerFilterPickerProps {
  roster: RosterEntry[];
  filter: string | null;
  matchCount: number;
  totalMatches: number;
  onFilterChange: (player: string | null) => void;
}

export default function PlayerFilterPicker({
  roster,
  filter,
  matchCount,
  totalMatches,
  onFilterChange,
}: PlayerFilterPickerProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleSelect(username: string) {
    onFilterChange(username);
    setSheetOpen(false);
  }

  return (
    <>
      <div className="px-5 pb-3">
        {!filter ? (
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full flex items-center justify-between bg-surface border border-border rounded-xl px-3.5 py-2.5 text-text"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              {t("matchHistory.filterHeadline")}
            </span>
            <span
              className="text-text-dim text-[11px] italic"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("matchHistory.filterStats", {
                count: totalMatches,
                players: roster.length,
              })}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5 bg-us/10 border border-us/40 rounded-xl px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-us text-white flex items-center justify-center font-extrabold text-[11px] shrink-0">
              {initialsOf(filter)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-text capitalize leading-none">
                {filter}
              </p>
              <p
                className="text-[11px] text-text-dim italic leading-tight mt-0.5"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {matchCount} {matchCount === 1 ? "partida" : "partidas"}
              </p>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="text-us border border-us/40 text-[11px] font-semibold px-3 py-1 rounded-full"
            >
              {t("settings.change").toLowerCase()}
            </button>
            <button
              onClick={() => onFilterChange(null)}
              aria-label="Quitar filtro"
              className="text-text-dim p-1 flex items-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        headline={t("matchHistory.filterPickerTitle")}
        scrollable
      >
        <ul>
          {roster.map((entry, i) => (
            <li key={entry.username}>
              {i > 0 && <div className="h-px bg-border/50" />}
              <button
                onClick={() => handleSelect(entry.username)}
                className="w-full flex items-center gap-3.5 py-3.5 text-left active:opacity-70 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-[12px] text-text-dim shrink-0">
                  {initialsOf(entry.username)}
                </div>
                <span className="flex-1 min-w-0 text-[16px] font-semibold text-text capitalize">
                  {entry.username}
                </span>
                <span
                  className="text-text-dim text-[12px] italic shrink-0"
                  style={{ fontFamily: "var(--font-crimson-pro), serif" }}
                >
                  {entry.matchCount}{" "}
                  {entry.matchCount === 1 ? "partida" : "partidas"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
}
