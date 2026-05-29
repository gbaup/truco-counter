import { NextResponse } from "next/server";
import { getUserStats, type Scope } from "@/lib/queries";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("groupId");
        const scope: Scope = groupId ? { type: "group", groupId } : { type: "global" };
        const data = await getUserStats(scope);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in user stats API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
