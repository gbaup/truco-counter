"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * usePointLog — "el relato": agrupa los toques de puntaje en MANOS.
 *
 * Una MANO es una ventana de tiempo (debounce) durante la cual se
 * acumulan TODOS los toques, de los DOS equipos. Esto es importante:
 * en truco una misma mano puede dar puntos a los dos (envido a uno,
 * truco al otro) → la entrada del relato guarda lo que sacó cada lado:
 * { us, them }. No es "+N de un equipo", es el resultado de la mano.
 *
 * Mecánica de la ventana (debounce con tope):
 *   - El primer toque ABRE la mano y arranca un timer de WINDOW_MS.
 *   - Cada toque siguiente reinicia el timer (se siguen agrupando).
 *   - Pero la mano nunca queda abierta más de MAX_WAIT_MS (tope), así
 *     una racha de toques lentos igual cierra y no fusiona dos manos.
 *   - Al cerrar, si el neto de la mano es 0 (ej: +1 y después −1), no
 *     se registra nada.
 *
 * Correcciones (−): mientras la ventana está ABIERTA, un − resta del
 * acumulado de ese equipo. Un − que llega con la ventana ya cerrada
 * queda fuera del alcance de este hook (manejalo como "deshacer
 * última mano" si lo necesitás; ver nota al final).
 *
 * Cliente-only: el relato vive en memoria + localStorage por matchId.
 * No toca la base ni el stream en vivo (ver IMPLEMENTATION.md § Alcance).
 */

const WINDOW_MS = 2500; // se cierra la mano tras 2.5 s sin tocar
const MAX_WAIT_MS = 6000; // tope: nunca deja la mano abierta más de 6 s

export type TimeStyle = "rel" | "hora";

export type Side = "us" | "them";

export interface Mano {
  id: string;
  us: number;
  them: number;
  ts: number; // epoch ms — cuándo arrancó la mano (para el "hace …")
}

interface PendingMano {
  us: number;
  them: number;
  ts: number;
}

const STORAGE_PREFIX = "truco-relato:";
const key = (matchId?: string) => `${STORAGE_PREFIX}${matchId ?? "free"}`;

function load(matchId?: string): Mano[] {
  try {
    const raw = localStorage.getItem(key(matchId));
    return raw ? (JSON.parse(raw) as Mano[]) : [];
  } catch {
    return [];
  }
}

function save(matchId: string | undefined, manos: Mano[]) {
  try {
    localStorage.setItem(key(matchId), JSON.stringify(manos));
  } catch {
    /* almacenamiento lleno / no disponible — el relato es best-effort */
  }
}

export function clearPointLog(matchId?: string) {
  try {
    localStorage.removeItem(key(matchId));
  } catch {
    /* noop */
  }
}

export interface PointLog {
  /** Manos cerradas, más reciente primero. */
  manos: Mano[];
  /** La mano en curso (ventana abierta), o null. */
  pending: PendingMano | null;
  /** Llamar en cada toque, junto al increment/decrement del score. */
  register: (side: Side, dir: 1 | -1) => void;
  /** Borrar todo (al terminar/cancelar el partido). */
  reset: () => void;
}

export function usePointLog(matchId?: string): PointLog {
  const [prevMatchId, setPrevMatchId] = useState<string | undefined>(matchId);
  const [manos, setManos] = useState<Mano[]>(() =>
    typeof window === "undefined" ? [] : load(matchId)
  );
  const [pending, setPending] = useState<PendingMano | null>(null);

  const pendingRef = useRef<PendingMano | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-hidratar state cuando cambia el matchId (render-phase — sin tocar refs).
  if (prevMatchId !== matchId) {
    setPrevMatchId(matchId);
    setManos(typeof window === "undefined" ? [] : load(matchId));
    setPending(null);
  }

  // Limpiar timer y pending ref cuando cambia el matchId (solo refs, sin setState).
  useEffect(() => {
    pendingRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [matchId]);

  const commit = useCallback(
    (mid?: string) => {
      const p = pendingRef.current;
      pendingRef.current = null;
      setPending(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!p || (p.us <= 0 && p.them <= 0)) return; // mano nula → no se anota
      const mano: Mano = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${p.ts}-${Math.random()}`,
        us: Math.max(0, p.us),
        them: Math.max(0, p.them),
        ts: p.ts,
      };
      setManos((prev) => {
        const next = [mano, ...prev];
        save(mid, next);
        return next;
      });
    },
    []
  );

  const register = useCallback(
    (side: Side, dir: 1 | -1) => {
      const now = Date.now();
      const prev = pendingRef.current ?? { us: 0, them: 0, ts: now };
      const p: PendingMano = { ...prev, [side]: prev[side] + dir };
      pendingRef.current = p;
      setPending(p);

      if (timerRef.current) clearTimeout(timerRef.current);
      const sinceStart = now - p.ts;
      const wait = Math.min(WINDOW_MS, Math.max(0, MAX_WAIT_MS - sinceStart));
      timerRef.current = setTimeout(() => commit(matchId), wait);
    },
    [commit, matchId]
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingRef.current = null;
    setPending(null);
    setManos([]);
    clearPointLog(matchId);
  }, [matchId]);

  // Cerrar la mano abierta si el componente se desmonta.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { manos, pending, register, reset };
}

/**
 * NOTA — "deshacer última mano":
 * Este hook agrupa toques dentro de la ventana. Si querés que un − con
 * la ventana ya cerrada edite la última mano cerrada, envolvé `register`
 * en el consumer: si pending es null y dir === -1, hacé pop/patch del
 * primer elemento de `manos` en vez de abrir una mano nueva. Se dejó
 * afuera para mantener el hook simple y predecible.
 */
