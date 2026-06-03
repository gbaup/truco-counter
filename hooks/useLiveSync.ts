import { useCallback, useEffect, useRef } from "react";
import { Hand } from "@/types/match";
import { postLiveHand, clearLiveLog } from "@/services/matchService";

export function useLiveSync(
  matchId: string | undefined,
  groupId: string | undefined,
  isFreePlay: boolean
) {
  const ref = useRef({ matchId, groupId, isFreePlay });
  useEffect(() => {
    ref.current = { matchId, groupId, isFreePlay };
  });

  const onHandCommit = useCallback((hand: Hand) => {
    const { matchId: mid, groupId: gid, isFreePlay: fp } = ref.current;
    if (!fp && mid && gid) {
      postLiveHand(gid, mid, hand).catch(() => {});
    }
  }, []);

  const clearOnFinish = useCallback(() => {
    const { matchId: mid, groupId: gid, isFreePlay: fp } = ref.current;
    if (!fp && mid && gid) {
      clearLiveLog(gid, mid).catch(() => {});
    }
  }, []);

  return { onHandCommit, clearOnFinish };
}
