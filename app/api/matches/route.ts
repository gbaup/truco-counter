import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { score1, score2, winner_team, team1, team2 } = body;

        // Basic validation
        if (
            score1 === undefined ||
            score2 === undefined ||
            !winner_team ||
            !team1 ||
            !team2
        ) {
            return NextResponse.json(
                { error: "Missing required match data" },
                { status: 400 }
            );
        }

        // 1. Insert Match
        const { data: match, error: matchError } = await supabaseAdmin
            .from("matches")
            .insert({
                score_team_1: score1,
                score_team_2: score2,
                winner_team: winner_team,
                status: "finished",
            })
            .select()
            .single();

        if (matchError) {
            throw matchError;
        }

        // 2. Prepare Participants
        const participants = [
            ...team1.map((user: any) => ({
                match_id: match.id,
                user_id: user.id,
                team: 1,
            })),
            ...team2.map((user: any) => ({
                match_id: match.id,
                user_id: user.id,
                team: 2,
            })),
        ];

        // 3. Insert Participants
        const { error: participantsError } = await supabaseAdmin
            .from("match_participants")
            .insert(participants);

        if (participantsError) {
            throw participantsError;
        }

        return NextResponse.json(match);
    } catch (error) {
        console.error("Error saving match API:", error);
        return NextResponse.json(
            { error: "Failed to save match" },
            { status: 500 }
        );
    }
}
