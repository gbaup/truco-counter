import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("user_stats")
            .select("user_id, username, wins, losses");

        if (error) {
            console.error("Error fetching user stats:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error("Error in user stats API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}