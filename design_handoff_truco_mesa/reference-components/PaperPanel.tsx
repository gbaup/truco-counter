"use client";

import { twMerge } from "tailwind-merge";

/**
 * PaperPanel — cream-paper rectangle with notebook lines and inset shadow.
 * This is the SIGNATURE component of the design system. Used to host
 * Palitos in the counter, the player card in profile/sidebar, and the
 * top-1 spotlight in the ranking.
 *
 * The notebook lines come from the `.paper-lines` utility in globals.css.
 */

interface PaperPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Set to false to remove the notebook lines (e.g. for the player card). */
  lines?: boolean;
}

export default function PaperPanel({
  children,
  className,
  lines = true,
}: PaperPanelProps) {
  return (
    <div
      className={twMerge(
        "relative overflow-hidden rounded-lg px-2 py-3",
        "bg-gradient-to-b from-paper to-paper-shade",
        "text-paper-ink",
        "shadow-paper",
        className,
      )}
    >
      {lines && (
        <div
          className="paper-lines pointer-events-none absolute inset-0"
          aria-hidden
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
