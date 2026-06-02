"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";
import { useUserStats } from "./useUserStats";
import { useMatches } from "./useMatches";
import { winRate } from "@/lib/domain/ratings";
import { GroupUserStats } from "@/types/database";
import { MatchHistoryItem } from "@/types/match";

type Session = NonNullable<ReturnType<typeof useCurrentUser>["data"]>;

type ProfileData =
  | { isLoading: true; me: null; stats: null; matches: MatchHistoryItem[]; winRate: number; streak: number }
  | { isLoading: false; me: Session; stats: GroupUserStats | null; matches: MatchHistoryItem[]; winRate: number; streak: number }
  | { isLoading: false; me: null; stats: null; matches: MatchHistoryItem[]; winRate: number; streak: number };

export function useProfileData(): ProfileData {
  const router = useRouter();
  const { data: me, isPending: meLoading } = useCurrentUser();
  const { data: rawStats = [], isPending: statsLoading } = useUserStats();
  const allStats = rawStats as GroupUserStats[];
  const { data: matches = [], isPending: matchesLoading } = useMatches(me?.userId, { enabled: !!me?.userId });

  useEffect(() => {
    if (!meLoading && !me) router.replace("/login");
  }, [me, meLoading, router]);

  const isLoading = meLoading || statsLoading || matchesLoading;

  if (isLoading) {
    return { isLoading: true, me: null, stats: null, matches: [], winRate: 0, streak: 0 };
  }

  if (!me) {
    return { isLoading: false, me: null, stats: null, matches: [], winRate: 0, streak: 0 };
  }

  const stats = allStats.find((s) => s.user_id === me.userId) ?? null;
  const rate = stats ? winRate(stats.wins, stats.losses) : 0;

  let streak = 0;
  for (const m of matches) {
    const userTeam = m.match_participants.find((p) => p.user_id === me.userId)?.team;
    if (m.winner_team !== null && m.winner_team === userTeam) {
      streak++;
    } else {
      break;
    }
  }

  return { isLoading: false, me, stats, matches, winRate: rate, streak };
}
