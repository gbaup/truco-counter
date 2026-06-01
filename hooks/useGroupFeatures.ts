"use client";

import { useActiveGroup } from "@/hooks/useActiveGroup";
import type { GroupFeatures } from "@/types/group";

export function useGroupFeatures(): Record<keyof GroupFeatures, boolean> {
  const { activeGroup, isFreePlay } = useActiveGroup();
  if (isFreePlay) {
    return { liveMatch: false, pointsLogs: true, glickoRanking: false };
  }
  const f = (activeGroup?.features ?? {}) as Partial<GroupFeatures>;
  return {
    liveMatch: f.liveMatch === true,
    pointsLogs: f.pointsLogs === true,
    glickoRanking: f.glickoRanking === true,
  };
}
