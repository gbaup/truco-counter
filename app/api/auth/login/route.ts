import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

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

        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (error || !user) {
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

        // Generate JWT
        const token = await signToken({ userId: user.id, username: user.username });

        const response = NextResponse.json({ success: true, user });

        // Set HttpOnly Cookie
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
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
