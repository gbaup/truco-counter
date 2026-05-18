import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.users.update({
        where: { id: session.userId as string },
        data: { google_id: null },
    });

    return NextResponse.json({ success: true });
}
