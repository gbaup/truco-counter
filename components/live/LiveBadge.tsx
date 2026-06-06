"use client";

import { useTranslation } from "react-i18next";

type LiveDotProps = {
  size?: number;
  ring?: boolean;
};

export function LiveDot({ size = 8, ring = false }: LiveDotProps) {
  return (
    <span
      className="inline-block rounded-full bg-danger"
      style={{
        width: size,
        height: size,
        animation: "lvBlink 1.2s ease-in-out infinite",
        ...(ring ? { border: "2px solid var(--color-background)" } : null),
      }}
    />
  );
}

export function LiveBadge() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full bg-danger/10 border border-danger/55 text-danger py-[5px] pl-[9px] pr-[11px] text-[10.5px] font-bold tracking-[0.12em]">
      <LiveDot size={7} />
      {t("live.badge").toUpperCase()}
    </span>
  );
}

export function MiniScore({
  us,
  them,
  big = false,
}: {
  us: number;
  them: number;
  big?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center leading-none font-black tracking-[-0.03em]"
      style={{ gap: big ? 8 : 5, fontFamily: "var(--font-space-grotesk), sans-serif" }}
    >
      <span className="text-us" style={{ fontSize: big ? 26 : 14 }}>{us}</span>
      <span className="text-text-mute font-semibold" style={{ fontSize: big ? 18 : 12 }}>–</span>
      <span className="text-them" style={{ fontSize: big ? 26 : 14 }}>{them}</span>
    </span>
  );
}
