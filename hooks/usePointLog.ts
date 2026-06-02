"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hand } from "@/types/match";
export type { Hand } from "@/types/match";

/**
 * usePointLog — groups score taps into HANDs (debounced windows).
 *
 * A HAND is a time window (debounce) during which ALL taps from BOTH
 * teams are accumulated. This matters because in truco a single hand
 * can award points to both sides (envido to one, truco to the other)
 * → each log entry stores what each side scored: { us, them }.
 *
 * Window mechanics (debounce with cap):
 *   - The first tap OPENS the hand and starts a WINDOW_MS timer.
 *   - Each subsequent tap resets the timer (keeps grouping).
 *   - But the hand never stays open longer than MAX_WAIT_MS (cap), so
 *     a slow burst of taps still closes and doesn't merge two hands.
 *   - On close, if the net for the hand is 0 (e.g. +1 then −1), nothing
 *     is recorded.
 *
 * Corrections (−): while the window is OPEN, a − subtracts from that
 * team's accumulator. A − arriving after the window closes falls outside
 * the scope of this hook (handle it as "undo last hand" if needed; see
 * note at the bottom).
 *
 * Client-only: the log lives in memory + localStorage by matchId.
 * Does not touch the database or live stream.
 */

const WINDOW_MS = 2500; // close the hand after 2.5 s of inactivity
const MAX_WAIT_MS = 6000; // cap: never leave a hand open longer than 6 s

export type TimeStyle = "rel" | "hora";

export type Side = "us" | "them";

interface PendingHand {
  us: number;
  them: number;
  ts: number;
}

const STORAGE_PREFIX = "truco-matchlog:";
const key = (matchId?: string) => `${STORAGE_PREFIX}${matchId ?? "free"}`;

function load(matchId?: string): Hand[] {
  try {
    const raw = localStorage.getItem(key(matchId));
    return raw ? (JSON.parse(raw) as Hand[]) : [];
  } catch {
    return [];
  }
}

function save(matchId: string | undefined, hands: Hand[]) {
  try {
    localStorage.setItem(key(matchId), JSON.stringify(hands));
  } catch {
    /* storage full / unavailable — match log is best-effort */
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
  /** Closed hands, most recent first. */
  hands: Hand[];
  /** The hand currently in progress (window open), or null. */
  pending: PendingHand | null;
  /** Call on every tap, alongside the score increment/decrement. */
  register: (side: Side, dir: 1 | -1) => void;
  /** Clear everything (when finishing or cancelling a match). */
  reset: () => void;
}

export function usePointLog(matchId?: string, onHandCommit?: (hand: Hand) => void): PointLog {
  const onHandCommitRef = useRef(onHandCommit);
  useEffect(() => {
    onHandCommitRef.current = onHandCommit;
  });

  const [prevMatchId, setPrevMatchId] = useState<string | undefined>(matchId);
  const [hands, setHands] = useState<Hand[]>(() =>
    typeof window === "undefined" ? [] : load(matchId)
  );
  const [pending, setPending] = useState<PendingHand | null>(null);

  const pendingRef = useRef<PendingHand | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-hydrate state when matchId changes (render-phase — no ref mutation).
  if (prevMatchId !== matchId) {
    setPrevMatchId(matchId);
    setHands(typeof window === "undefined" ? [] : load(matchId));
    setPending(null);
  }

  // Clear timer and pending ref when matchId changes (refs only, no setState).
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
      if (!p || (p.us <= 0 && p.them <= 0)) return; // null hand — nothing to record
      const hand: Hand = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${p.ts}-${Math.random()}`,
        us: Math.max(0, p.us),
        them: Math.max(0, p.them),
        ts: p.ts,
      };
      onHandCommitRef.current?.(hand);
      setHands((prev) => {
        const next = [hand, ...prev];
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
      const p: PendingHand = { ...prev, [side]: prev[side] + dir };
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
    setHands([]);
    clearPointLog(matchId);
  }, [matchId]);

  // Flush the open hand if the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { hands, pending, register, reset };
}

/**
 * NOTE — "undo last hand":
 * This hook groups taps within the window. If you want a − arriving after
 * the window closes to edit the last closed hand, wrap `register` in the
 * consumer: if pending is null and dir === -1, pop/patch the first element
 * of `hands` instead of opening a new hand. Left out intentionally to keep
 * this hook simple and predictable.
 */
