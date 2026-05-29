"use client";

import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

interface ConfirmationExitModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationExitModal({ open, onConfirm, onCancel }: ConfirmationExitModalProps) {
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
          <h2
            className="mb-2 text-2xl font-black text-text"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("confirmationExitModal.title")}
          </h2>
          <p
            className="mb-8 text-caption-italic text-text-dim"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("confirmationExitModal.description")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-surface-elevated border border-border py-4 font-bold text-text transition-all hover:bg-border active:scale-95"
            >
              {t("confirmationExitModal.cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-danger py-4 font-bold text-white transition-all hover:bg-danger/90 active:scale-95"
            >
              {t("confirmationExitModal.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
