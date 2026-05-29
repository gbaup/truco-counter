"use client";

import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/Button";

interface WinnerModalProps {
  open: boolean;
  winner: string | null;
  onFinish: () => void;
  isLoading?: boolean;
}

export default function WinnerModal({ open, winner, onFinish, isLoading }: WinnerModalProps) {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden={!open}
      className={twMerge(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        className={twMerge(
          "absolute inset-0 transition-opacity duration-200",
          "bg-[rgba(13,16,14,0.65)] backdrop-blur-[6px]",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        className={twMerge(
          "absolute inset-0 flex items-center justify-center p-4",
          "transition-[transform,opacity] duration-[240ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="w-full max-w-sm rounded-[22px] bg-surface border border-border p-8 text-center shadow-hero">
          <div className="mb-4 text-6xl">🏆</div>
          <h2
            className="mb-2 text-3xl font-black text-text"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("winnerModal.title", { winner })}
          </h2>
          <p
            className="mb-8 text-caption-italic text-text-dim"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("winnerModal.description")}
          </p>
          <Button onClick={onFinish} disabled={isLoading}>
            {isLoading ? t("winnerModal.button.loading") : t("winnerModal.button.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
