import { PublicUser } from "./database";

export interface CreateMatchDto {
    score1?: number;
    score2?: number;
    winner_team?: number;
    team1: PublicUser[];
    team2: PublicUser[];
    status?: "ongoing" | "finished";
}

export interface UpdateMatchDto {
    score1?: number;
    score2?: number;
    winner_team?: number;
    status?: "ongoing" | "finished" | "cancelled";
}
