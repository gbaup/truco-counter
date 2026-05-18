import { NextResponse } from "next/server";
import { Session } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (_request, session: Session) => {
    const user = await prisma.users.findUnique({
        where: { id: session.userId },
        select: { google_id: true },
    });

    return NextResponse.json({
        userId: session.userId,
        username: session.username,
        role: session.role,
        googleLinked: !!user?.google_id,
    });
});
