import { NextResponse } from "next/server";
import { getUserStats, getGroupUserStats } from "@/lib/queries";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("groupId");
        const data = groupId
            ? await getGroupUserStats(groupId)
            : await getUserStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in user stats API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
