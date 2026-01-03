import { PublicUser } from "./database";

export interface CreateMatchDto {
    score1: number;
    score2: number;
    winner_team: number;
    team1: PublicUser[];
    team2: PublicUser[];
}
