import { useState, useEffect } from "react";
import { PublicUser } from "@/types/database";
import { MatchState } from "@/types/game";
import { createMatch, updateMatch, saveMatch } from "@/services/matchService";

const STORAGE_KEY = "truco-match-state";

export function useMatch() {
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
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                setMatchState(JSON.parse(savedState));
            } catch (error) {
                console.error("Failed to parse saved match state", error);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
        }
    }, [matchState, isLoaded]);

    const startMatch = async (team1: PublicUser[], team2: PublicUser[], maxPoints: number) => {
        if (isStarting) return;
        setIsStarting(true);
        try {
            const match = await createMatch({ team1, team2, status: "ongoing" });
            setMatchState({
                view: "match",
                team1, team2, maxPoints,
                score1: 0, score2: 0,
                matchId: match.id,
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "PLAYERS_BUSY") throw error;
            console.error(error);
        } finally {
            setIsStarting(false);
        }
    };

    const incrementScore = (team: 1 | 2) => {
        setMatchState((prev) => {
            const currentScore = team === 1 ? prev.score1 : prev.score2;
            if (currentScore >= prev.maxPoints) return prev;
            return {
                ...prev,
                [team === 1 ? 'score1' : 'score2']: currentScore + 1
            };
        });
    };

    const decrementScore = (team: 1 | 2) => {
        setMatchState((prev) => {
            const currentScore = team === 1 ? prev.score1 : prev.score2;
            if (currentScore <= 0) return prev;
            return {
                ...prev,
                [team === 1 ? 'score1' : 'score2']: currentScore - 1
            };
        });
    };

    const finishMatch = async (result: { score1: number; score2: number; status?: "finished" | "cancelled" }) => {
        if (isSaving) return;
        setIsSaving(true);

        const winner_team = result.score1 >= matchState.maxPoints ? 1 : result.score2 >= matchState.maxPoints ? 2 : null;

        if (winner_team || result.status === "cancelled") {
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
            }
        }

        setIsSaving(false);
        setMatchState({
            view: "setup",
            team1: [], team2: [], maxPoints: 30, score1: 0, score2: 0,
        });
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        matchState,
        isLoaded,
        isStarting,
        isSaving,
        startMatch,
        finishMatch,
        incrementScore,
        decrementScore
    };
}