import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USERNAME_RE, NAME_RE, EMAIL_RE } from "@/lib/validators";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "false") {
    return NextResponse.json({ success: false, error: "Registration is disabled" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, lastName, username, email, password } = body;

    if (!name || !lastName || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!NAME_RE.test(name.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid name format" },
        { status: 400 }
      );
    }

    if (!NAME_RE.test(lastName.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid last name format" },
        { status: 400 }
      );
    }

    if (!USERNAME_RE.test(username.trim().toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Username must be 3-20 chars: lowercase letters, digits, underscores only" },
        { status: 400 }
      );
    }

    if (email && !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existingUsername = await prisma.users.findFirst({
      where: { username: { equals: normalizedUsername, mode: "insensitive" } },
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.users.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: name.trim().toLowerCase(),
        last_name: lastName.trim().toLowerCase(),
        username: normalizedUsername,
        email: email ? email.trim().toLowerCase() : null,
        password: hashedPassword,
        password_changed: true,
      },
    });

    const token = await signToken({ userId: user.id, username: user.username, role: user.role });

    const { password: _password, google_id: _googleId, ...publicUser } = user;

    const response = NextResponse.json({ success: true, user: publicUser });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
