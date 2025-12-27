import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

        // Return the user object (excluding the password ideally, but for now matching existing behavior)
        // Be careful not to expose sensitive data if the client doesn't need it.
        // The original service returned the whole user object.
        return NextResponse.json({ success: true, user });
    } catch (err) {
        console.error("Login API error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
