import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getSession() as Session | null;
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
        where: { id: session.userId as string },
        select: { google_id: true },
    });

    return NextResponse.json({
        userId: session.userId,
        username: session.username,
        role: session.role,
        googleLinked: !!user?.google_id,
    });
}
