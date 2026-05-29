import { NextResponse } from "next/server";
import { getUserStats, type Scope } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { assertGroupMember } from "@/lib/withAuth";
import { Session } from "@/types/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("groupId");

        if (groupId) {
            const session = (await getSession()) as Session | null;
            if (!session?.userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const rejection = await assertGroupMember(groupId, session.userId);
            if (rejection) return rejection;
        }

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
