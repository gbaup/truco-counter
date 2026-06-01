"use client";

import { useActiveGroup } from "@/hooks/useActiveGroup";
import { getGroupFeatures } from "@/lib/domain/groupFeatures";

export function useGroupFeatures() {
  const { activeGroup, isFreePlay } = useActiveGroup();
  return getGroupFeatures({ isFreePlay, activeGroup });
}
