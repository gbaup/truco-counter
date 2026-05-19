export async function exchangeCode(code: string): Promise<string> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
            grant_type: "authorization_code",
        }),
    });
    if (!res.ok) throw new Error("Token exchange failed");
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
}

export async function fetchGoogleUser(
    accessToken: string
): Promise<{ id: string; email: string }> {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch Google user info");
    return res.json() as Promise<{ id: string; email: string }>;
}
