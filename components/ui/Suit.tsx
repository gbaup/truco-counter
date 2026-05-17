"use client";

/**
 * Spanish-suit pip — the 4 palos del truco uruguayo.
 *
 * IMPORTANT: never use English suits (spade/club/heart/diamond) here.
 * The deck is `baraja española`: espada, basto, oro, copa.
 *
 * Mapping to team identity (see DESIGN.md):
 *   espada → Nosotros (us) — the highest card in truco
 *   basto  → Ellos (them) — second-highest
 *   oro, copa → decorative only (login, modals)
 *
 * Render rules:
 *   - valid sizes: 10, 12, 14, 20, 22, 50 (px)
 *   - color inherits from the `color` prop; on `paper` use `paper-ink`,
 *     on dark use the team color or `text`.
 *   - fill-only silhouette. No outlines, no gradients.
 */

export type SuitKind = "espada" | "basto" | "oro" | "copa";

interface SuitProps {
  kind?: SuitKind;
  size?: number;
  color?: string;
  className?: string;
}

export default function Suit({
  kind = "espada",
  size = 14,
  color = "currentColor",
  className,
}: SuitProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    className,
  };

  if (kind === "basto") {
    return (
      <svg {...common}>
        <path d="M9.5 2.5 Q 8 3.5 8.5 5.5 L 10 12 Q 9 17 10 20.5 L 11 21.5 L 13 21.5 L 14 20.5 Q 15 17 14 12 L 15.5 5.5 Q 16 3.5 14.5 2.5 Q 12 3 9.5 2.5 Z" />
        <rect x="9.5" y="19" width="5" height="0.8" opacity="0.5" />
      </svg>
    );
  }

  if (kind === "oro") {
    return (
      <svg {...common}>
        <path
          d="M12 1.5 A 10.5 10.5 0 1 0 12 22.5 A 10.5 10.5 0 1 0 12 1.5 Z M 12 8 A 4 4 0 1 1 12 16 A 4 4 0 1 1 12 8 Z"
          fillRule="evenodd"
        />
        <circle cx="12" cy="3.5" r="0.7" />
        <circle cx="20.5" cy="12" r="0.7" />
        <circle cx="12" cy="20.5" r="0.7" />
        <circle cx="3.5" cy="12" r="0.7" />
      </svg>
    );
  }

  if (kind === "copa") {
    return (
      <svg {...common}>
        <path d="M5 4 L19 4 L17.5 13 Q 12 16 6.5 13 Z" />
        <rect x="5" y="3" width="14" height="1.2" rx="0.4" />
        <rect x="11" y="15.5" width="2" height="3.5" />
        <path d="M7 19 L 17 19 Q 18 19 18 20 L 18 21 L 6 21 L 6 20 Q 6 19 7 19 Z" />
      </svg>
    );
  }

  // espada — the default
  return (
    <svg {...common}>
      <path d="M11 2 L 13 2 L 13 14 L 11 14 Z" />
      <path d="M11 2 L 13 2 L 12 1 Z" />
      <path d="M5 13.5 L 19 13.5 Q 19.5 13.5 19 14.5 L 17 16 L 7 16 L 5 14.5 Q 4.5 13.5 5 13.5 Z" />
      <rect x="10.5" y="16" width="3" height="4" />
      <rect x="10.5" y="17.5" width="3" height="0.7" opacity="0.5" />
      <circle cx="12" cy="21" r="1.4" />
    </svg>
  );
}
