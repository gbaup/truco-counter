"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveGroup } from "@/hooks/useActiveGroup";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LiveMatchView from "@/components/live/LiveMatchView";
import SideDrawer from "@/components/SideDrawer";

export default function LivePage() {
  const router = useRouter();
  const { data: me } = useCurrentUser();
  const { activeGroupId } = useActiveGroup();
  const { data: liveData, isLoading } = useLiveMatch(activeGroupId ?? undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !liveData?.live) {
      router.replace("/");
    }
  }, [liveData?.live, isLoading, router]);

  if (!me || isLoading || !liveData?.live) return null;

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
        onExit={() => router.push("/")}
        onOpenMenu={() => setDrawerOpen(true)}
      />
    </div>
  );
}
