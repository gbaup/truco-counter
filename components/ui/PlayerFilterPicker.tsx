"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import BottomSheet from "@/components/ui/BottomSheet";
import PlayerAvatar from "@/components/ui/PlayerAvatar";
import { FilterIcon, CloseIcon, CheckIcon } from "@/components/ui/icons";
import type { RosterEntry } from "@/types/match";

interface PlayerFilterPickerProps {
  roster: RosterEntry[];
  selectedPlayers: string[];
  matchCount: number;
  totalMatches: number;
  onFilterChange: (players: string[]) => void;
}

export default function PlayerFilterPicker({
  roster,
  selectedPlayers,
  matchCount,
  totalMatches,
  onFilterChange,
}: PlayerFilterPickerProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  function handleOpenSheet() {
    setTempSelected(selectedPlayers);
    setSheetOpen(true);
  }

  function handleToggle(username: string) {
    setTempSelected((prev) => {
      if (prev.includes(username)) {
        return prev.filter((p) => p !== username);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, username];
      }
    });
  }

  return (
    <>
      <div className="px-5 pb-3">
        {selectedPlayers.length === 0 ? (
          <button
            onClick={handleOpenSheet}
            className="w-full flex items-center justify-between bg-surface border border-border rounded-xl px-3.5 py-2.5 text-text"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold">
              <FilterIcon size={14} />
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
          <div className="flex items-center gap-2.5 bg-us/10 border border-us/40 rounded-xl px-2.5 py-1.5">
            <div className="flex -space-x-2 shrink-0 pr-1">
              {selectedPlayers.map((player) => {
                const entry = roster.find((e) => e.username === player);
                return (
                  <PlayerAvatar
                    key={player}
                    name={entry?.name ?? player}
                    lastName={entry?.last_name}
                    className="border-2 border-background w-8 h-8 text-[11px]"
                  />
                );
              })}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-text capitalize leading-none truncate">
                {selectedPlayers.join(" + ")}
              </p>
              <p
                className="text-[11px] text-text-dim italic leading-tight mt-0.5"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {t("matchHistory.matchCount", { count: matchCount })}
              </p>
            </div>
            <button
              onClick={handleOpenSheet}
              className="text-us border border-us/40 text-[11px] font-semibold px-3 py-1 rounded-full shrink-0"
            >
              {t("matchHistory.changeFilter")}
            </button>
            <button
              onClick={() => onFilterChange([])}
              aria-label={t("matchHistory.removeFilter")}
              className="text-text-dim p-1 flex items-center shrink-0"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        headline={t("matchHistory.filterPickerTitle")}
        scrollable
        submit={{
          label: t("matchHistory.filterApply"),
          onSubmit: () => {
            onFilterChange(tempSelected);
            setSheetOpen(false);
          },
        }}
      >
        <ul>
          {roster.map((entry, i) => {
            const isSelected = tempSelected.includes(entry.username);
            const isDisabled = tempSelected.length >= 3 && !isSelected;

            return (
              <li key={entry.username}>
                {i > 0 && <div className="h-px bg-border/50" />}
                <button
                  onClick={() => handleToggle(entry.username)}
                  disabled={isDisabled}
                  className={twMerge(
                    "w-full flex items-center gap-3.5 py-3.5 text-left transition-all",
                    isDisabled ? "opacity-30 cursor-not-allowed" : "active:opacity-70"
                  )}
                >
                  <PlayerAvatar
                    name={entry.name}
                    lastName={entry.last_name}
                    style={{
                      border: "1px solid transparent",
                      background:
                        "linear-gradient(var(--color-surface-elevated), var(--color-surface-elevated)) padding-box, linear-gradient(135deg, var(--color-us), var(--color-them)) border-box",
                    }}
                  />
                  <span className="flex-1 min-w-0 text-[16px] font-semibold text-text capitalize">
                    {entry.username}
                  </span>
                  <span
                    className="text-text-dim text-[12px] italic shrink-0 mr-1.5"
                    style={{ fontFamily: "var(--font-crimson-pro), serif" }}
                  >
                    {t("matchHistory.matchCount", { count: entry.matchCount })}
                  </span>
                  <div
                    className={twMerge(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0",
                      isSelected
                        ? "bg-us border-us text-white"
                        : "border-border bg-surface-elevated text-transparent"
                    )}
                  >
                    <CheckIcon size={10} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </>
  );
}
