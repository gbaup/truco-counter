/**
 * timeAgo — relative time display, driven by i18n.
 *
 * Always store absolute timestamps (epoch ms). This function derives the
 * display text at render time. To keep "2 min ago" fresh, re-render every
 * ~15 s (see useTick below).
 */

import { useEffect, useState } from "react";

type TFunc = (key: string, opts?: Record<string, unknown>) => string;

export function timeAgo(ts: number, t: TFunc, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 10) return t("timeAgo.justNow");
  if (s < 60) return t("timeAgo.seconds", { s });
  const m = Math.round(s / 60);
  if (m < 60) return t("timeAgo.minutes", { m });
  const h = Math.round(m / 60);
  return t("timeAgo.hours", { h });
}

/** Local clock time "HH:MM" — for the clock display mode of the match log. */
export function clockTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * useTick — forces a re-render every `ms` to keep "X ago" timestamps fresh.
 * Use in the match log component: `useTick(15000)`.
 */
export function useTick(ms: number = 15000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}
