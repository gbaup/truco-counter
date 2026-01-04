
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PublicUser } from "@/types/database";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: "Missing username or password" },
                { status: 400 }
            );
        }

        const user = await prisma.users.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid username or password" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid username or password" },
                { status: 401 }
            );
        }

        const token = await signToken({ userId: user.id, username: user.username });

        const { password: _, ...publicUser } = user;

        const response = NextResponse.json({ success: true, user: publicUser });

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Login API error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}