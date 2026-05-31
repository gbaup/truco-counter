"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useActiveGroup } from "@/hooks/useActiveGroup";
import { LiveMatchData } from "@/types/match";

type LiveMatchPayload = { live: LiveMatchData | null };

interface LiveMatchContextValue {
  data: LiveMatchPayload | undefined;
  isLoading: boolean;
}

const LiveMatchContext = createContext<LiveMatchContextValue>({
  data: { live: null },
  isLoading: false,
});

export function useLiveMatch(): LiveMatchContextValue {
  return useContext(LiveMatchContext);
}

export function LiveMatchProvider({ children }: { children: ReactNode }) {
  const { activeGroupId, isFreePlay } = useActiveGroup();
  const groupId = !isFreePlay ? (activeGroupId ?? undefined) : undefined;

  const [snapshot, setSnapshot] = useState<{ groupId: string; payload: LiveMatchPayload } | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const es = new EventSource(`/api/groups/${groupId}/live/stream`);

    es.onmessage = (e: MessageEvent) => {
      setSnapshot({ groupId, payload: JSON.parse(e.data) as LiveMatchPayload });
    };

    es.onerror = () => {
      setSnapshot((prev) => prev ?? { groupId, payload: { live: null } });
    };

    return () => es.close();
  }, [groupId]);

  const isCurrent = snapshot?.groupId === groupId;
  const value: LiveMatchContextValue = groupId
    ? { data: isCurrent ? snapshot!.payload : undefined, isLoading: !isCurrent }
    : { data: { live: null }, isLoading: false };

  return <LiveMatchContext.Provider value={value}>{children}</LiveMatchContext.Provider>;
}
