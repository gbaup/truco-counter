import { PublicUser } from "./database";

export interface MatchState {
    view: "setup" | "match";
    team1: PublicUser[];
    team2: PublicUser[];
    maxPoints: number;
    score1: number;
    score2: number;
    matchId?: string;
}
