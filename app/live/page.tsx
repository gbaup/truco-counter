"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveMatch } from "@/contexts/LiveMatchContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LiveMatchView from "@/components/live/LiveMatchView";
import SideDrawer from "@/components/SideDrawer";

export default function LivePage() {
  const router = useRouter();
  const { data: me } = useCurrentUser();
  const { data: liveData, isLoading } = useLiveMatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isScorer = !!me && !!liveData?.live && liveData.live.scorer === me.username;

  useEffect(() => {
    if (!isLoading && (!liveData?.live || isScorer)) {
      router.replace("/");
    }
  }, [liveData?.live, isLoading, isScorer, router]);

  if (!me || isLoading || !liveData?.live || isScorer) return null;

  const live = liveData.live;

  return (
    <div className="h-screen bg-background overflow-hidden">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />
      <LiveMatchView
        scoreUs={live.scoreUs}
        scoreThem={live.scoreThem}
        max={live.max}
        teamUs={live.teamUs}
        teamThem={live.teamThem}
        scorer={live.scorer}
        hands={live.hands}
        onExit={() => router.push("/")}
        onOpenMenu={() => setDrawerOpen(true)}
      />
    </div>
  );
}
