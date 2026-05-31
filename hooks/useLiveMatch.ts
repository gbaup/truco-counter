"use client";

import { useState, useEffect } from "react";

export interface LiveMatchData {
  matchId: string;
  scoreUs: number;
  scoreThem: number;
  max: number;
  teamUs: string[];
  teamThem: string[];
  scorer: string;
}

type Snapshot = { groupId: string; payload: { live: LiveMatchData | null } };

export function useLiveMatch(groupId?: string) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const es = new EventSource(`/api/groups/${groupId}/live/stream`);

    es.onmessage = (e: MessageEvent) => {
      setSnapshot({ groupId, payload: JSON.parse(e.data) as { live: LiveMatchData | null } });
    };

    es.onerror = () => {
      setSnapshot((prev) => prev ?? { groupId, payload: { live: null } });
    };

    return () => es.close();
  }, [groupId]);

  if (!groupId) return { data: { live: null as LiveMatchData | null }, isLoading: false };
  const isCurrent = snapshot?.groupId === groupId;
  return { data: isCurrent ? snapshot!.payload : undefined, isLoading: !isCurrent };
}
