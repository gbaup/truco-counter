import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (_request, session) => {
    await prisma.users.update({
        where: { id: session.userId },
        data: { google_id: null },
    });

    return NextResponse.json({ success: true });
});
