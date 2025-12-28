import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");

    if (!p1 || !p2) {
        return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin.rpc("get_users_versus", {
            player1_id: p1,
            player2_id: p2,
        });

        if (error) throw error;
        return NextResponse.json(data[0] || { total_matches: 0, p1_wins: 0, p2_wins: 0, draws: 0 });
    } catch (error: unknown) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }, { status: 500 });
    }
}