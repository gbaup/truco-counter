import { PublicUser } from "./database";

export interface MatchParticipantWithUser {
    user_id: string | null;
    team: number;
    rating_change: number | null;
    elo_rating_change: number | null;
    users: { username: string; name: string; last_name: string } | null;
}

export interface MatchHistoryItem {
    id: string;
    created_at: string;
    score_team_1: number;
    score_team_2: number;
    winner_team: number | null;
    match_participants: MatchParticipantWithUser[];
}

export interface CreateMatchDto {
    score1?: number;
    score2?: number;
    winner_team?: number | null;
    team1: PublicUser[];
    team2: PublicUser[];
    status?: "ongoing" | "finished";
}

export interface UpdateMatchDto {
    score1?: number;
    score2?: number;
    winner_team?: number | null;
    status?: "ongoing" | "finished" | "cancelled";
}
