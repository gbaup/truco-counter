/**
 * timeAgo — "hace …" en español rioplatense, para el relato.
 *
 * Guardá SIEMPRE timestamps absolutos (epoch ms). Esta función deriva
 * el texto relativo en el momento de renderizar. Para que el "hace 2
 * min" se mantenga fresco, re-renderizá cada ~15 s (ver useTick abajo).
 */

import { useEffect, useState } from "react";

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 10) return "recién";
  if (s < 60) return `hace ${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return `hace ${h} h`;
}

/** Hora de reloj local "HH:MM" — para el modo "Reloj" del relato. */
export function clockTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * useTick — fuerza un re-render cada `ms` para refrescar los "hace …".
 * Usalo en el componente del relato: `useTick(15000)`.
 */
export function useTick(ms: number = 15000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}
