import { NextResponse } from "next/server";
import { getUserStats } from "@/lib/queries";

export async function GET() {
    try {
        const data = await getUserStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in user stats API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
