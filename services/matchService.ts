import { supabase } from "@/lib/supabase";
import { PublicUser } from "@/types/database";

export interface MatchResult {
  team1: PublicUser[];
  team2: PublicUser[];
  score1: number;
  score2: number;
  winner_team: 1 | 2;
}

export async function saveMatch(matchData: MatchResult) {
  try {
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        score_team_1: matchData.score1,
        score_team_2: matchData.score2,
        winner_team: matchData.winner_team,
        status: "finished",
      })
      .select()
      .single();

    if (matchError) throw matchError;

    const participants = [
      ...matchData.team1.map((user) => ({
        match_id: match.id,
        user_id: user.id,
        team: 1,
      })),
      ...matchData.team2.map((user) => ({
        match_id: match.id,
        user_id: user.id,
        team: 2,
      })),
    ];

    const { error: participantsError } = await supabase
      .from("match_participants")
      .insert(participants);

    if (participantsError) throw participantsError;

    return match;
  } catch (error) {
    console.error("Error saving match:", error);
    throw error;
  }
}
