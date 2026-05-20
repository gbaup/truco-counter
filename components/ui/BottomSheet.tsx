"use client";

import { useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

export interface BottomSheetSubmit {
  label: string;
  onSubmit: () => void;
  disabled?: boolean;
  saving?: boolean;
  savingLabel?: string;
  cancelLabel?: string;
}

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  overline?: string;
  headline: string;
  children: React.ReactNode;
  scrollable?: boolean;
  submit?: BottomSheetSubmit;
}

export default function BottomSheet({
  open,
  onClose,
  overline,
  headline,
  children,
  scrollable,
  submit,
}: BottomSheetProps) {
  const { t } = useTranslation();
  const headlineId = useId();
  const cancelText = submit?.cancelLabel ?? t("common.cancel");
  const savingText = submit?.savingLabel ?? t("common.saving");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submit?.saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submit?.saving, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={twMerge(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        onClick={submit?.saving ? undefined : onClose}
        className={twMerge(
          "absolute inset-0 transition-opacity duration-200",
          "bg-[rgba(13,16,14,0.65)] backdrop-blur-[6px]",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headlineId}
        className={twMerge(
          "absolute left-0 right-0 bottom-0",
          "bg-surface border-t border-border",
          "rounded-t-2xl pt-3 px-[22px]",
          scrollable ? "pb-[env(safe-area-inset-bottom,24px)] flex flex-col max-h-[80dvh]" : "pb-[30px]",
          "shadow-[0_-20px_40px_rgba(0,0,0,0.4)]",
          "transition-transform duration-[240ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" aria-hidden />

        <div className={twMerge(submit ? "mb-3.5 text-center" : "mb-2")}>
          {overline && (
            <p className="font-serif text-[11px] italic tracking-[0.18em] text-text-mute">
              {overline}
            </p>
          )}
          <h2
            id={headlineId}
            className={twMerge(
              "font-serif font-bold leading-tight text-text",
              overline ? "mt-0.5 text-[20px]" : "text-[26px] italic"
            )}
          >
            {headline}
          </h2>
        </div>

        <div
          className={twMerge(scrollable ? "overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden" : "", submit ? "mb-3.5" : "pb-4")}
          style={scrollable ? { scrollbarWidth: "none" } : undefined}
        >
          {children}
        </div>

        {submit && (
          <div className="flex gap-2 pb-[30px]">
            <button
              type="button"
              onClick={onClose}
              disabled={submit.saving}
              className={twMerge(
                "flex-1 rounded-2xl border border-border bg-transparent",
                "py-3.5 text-sm font-semibold text-text",
                "disabled:opacity-50"
              )}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={submit.onSubmit}
              disabled={submit.disabled || submit.saving}
              className={twMerge(
                "flex-[1.5] rounded-2xl bg-us py-3.5 text-sm font-bold text-white",
                "shadow-[0_8px_20px_-10px_theme(colors.us)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98] transition-transform"
              )}
            >
              {submit.saving ? savingText : submit.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
