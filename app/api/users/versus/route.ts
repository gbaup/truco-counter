import { NextResponse } from "next/server";
import { isValidUUID } from "@/lib/validators";
import { getUsersVersus, type Scope } from "@/lib/queries";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");
    const groupId = searchParams.get("groupId");

    if (!p1 || !p2) {
        return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    if (!isValidUUID(p1) || !isValidUUID(p2)) {
        return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    try {
        const scope: Scope = groupId ? { type: "group", groupId } : { type: "global" };
        const stats = await getUsersVersus(p1, p2, scope);
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error in versus API:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}
