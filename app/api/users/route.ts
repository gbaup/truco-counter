import { prisma } from "@/lib/prisma"; // Importamos tu cliente
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                username: true,
            },
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}