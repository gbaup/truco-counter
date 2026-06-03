import { useState, useEffect, useRef } from "react";
import { PublicUser } from "@/types/database";
import { MatchState } from "@/types/game";
import { createMatch, updateMatch, saveMatch } from "@/services/matchService";
import { determineWinner } from "@/lib/domain/match-display";
import {
    loadMatch,
    saveMatch as persistMatch,
    clearMatch,
} from "@/lib/persistence/matchStorage";
import { useActiveGroup } from "./useActiveGroup";
import { usePointLog } from "./usePointLog";
import { useLiveSync } from "./useLiveSync";

function useScoreSync(matchState: MatchState, isFreePlay: boolean) {
    const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (!matchState.matchId || isFreePlay || matchState.view !== "match") return;
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
            updateMatch(matchState.matchId!, { score1: matchState.score1, score2: matchState.score2 }).catch(() => {});
        }, 300);
    }, [matchState.score1, matchState.score2, matchState.matchId, matchState.view, isFreePlay]);
}

export function useMatch() {
    const { activeGroupId, isFreePlay, isGroupsPending } = useActiveGroup();
    const [matchState, setMatchState] = useState<MatchState>({
        view: "setup",
        team1: [],
        team2: [],
        maxPoints: 30,
        score1: 0,
        score2: 0,
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        const saved = loadMatch();
        if (saved) setMatchState(saved);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) persistMatch(matchState);
    }, [matchState, isLoaded]);

    useScoreSync(matchState, isFreePlay);

    const { onHandCommit, clearOnFinish } = useLiveSync(matchState.matchId, matchState.groupId, isFreePlay);
    const pointLog = usePointLog(matchState.matchId, onHandCommit);

    const startMatch = async (team1: PublicUser[], team2: PublicUser[], maxPoints: number) => {
        if (isStarting) return;
        setIsStarting(true);
        try {
            if (isFreePlay) {
                setMatchState({ view: "match", team1: [], team2: [], maxPoints, score1: 0, score2: 0 });
                return;
            }
            const match = await createMatch({ team1, team2, status: "ongoing", groupId: activeGroupId ?? undefined, maxPoints });
            setMatchState({
                view: "match",
                team1, team2, maxPoints,
                score1: 0, score2: 0,
                matchId: match.id,
                groupId: activeGroupId ?? undefined,
            });
        } catch (error: unknown) {
            throw error;
        } finally {
            setIsStarting(false);
        }
    };

    const incrementScore = (team: 1 | 2) => {
        const currentScore = team === 1 ? matchState.score1 : matchState.score2;
        if (currentScore >= matchState.maxPoints) return;
        setMatchState((prev) => {
            const s = team === 1 ? prev.score1 : prev.score2;
            if (s >= prev.maxPoints) return prev;
            return { ...prev, [team === 1 ? "score1" : "score2"]: s + 1 };
        });
        pointLog.register(team === 1 ? "us" : "them", +1);
    };

    const decrementScore = (team: 1 | 2) => {
        const currentScore = team === 1 ? matchState.score1 : matchState.score2;
        if (currentScore <= 0) return;
        setMatchState((prev) => {
            const s = team === 1 ? prev.score1 : prev.score2;
            if (s <= 0) return prev;
            return { ...prev, [team === 1 ? "score1" : "score2"]: s - 1 };
        });
        pointLog.register(team === 1 ? "us" : "them", -1);
    };

    const finishMatch = async (result: { score1: number; score2: number; status?: "finished" | "cancelled" }) => {
        if (isSaving) return;
        setIsSaving(true);

        const winner_team = determineWinner(result.score1, result.score2, matchState.maxPoints);

        if (!isFreePlay && (winner_team || result.status === "cancelled")) {
            try {
                if (matchState.matchId) {
                    await updateMatch(matchState.matchId, { ...result, winner_team });
                } else {
                    await saveMatch({
                        team1: matchState.team1,
                        team2: matchState.team2,
                        score1: result.score1,
                        score2: result.score2,
                        winner_team,
                    });
                }
            } catch (error) {
                console.error("Failed to save match:", error);
                setIsSaving(false);
                return;
            }
        }

        setIsSaving(false);
        clearOnFinish();
        setMatchState({
            view: "setup",
            team1: [], team2: [], maxPoints: 30, score1: 0, score2: 0,
        });
        pointLog.reset();
        clearMatch();
    };

    return {
        matchState,
        isLoaded,
        isStarting,
        isSaving,
        isFreePlay,
        isGroupsPending,
        startMatch,
        finishMatch,
        incrementScore,
        decrementScore,
        hands: pointLog.hands,
        pending: pointLog.pending,
    };
}
