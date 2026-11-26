import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

const DJANGO_API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const sessionToken = process.env.ADMIN_SESSION_TOKEN ?? "";

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Admin session not configured." },
      { status: 500 }
    );
  }

  // Validate credentials against Django's database-backed User model
  let djangoRes: Response;
  try {
    djangoRes = await fetch(`${DJANGO_API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { error: "Cannot reach backend — is the server running?" },
      { status: 502 }
    );
  }

  if (!djangoRes.ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure: true, // uncomment when deploying over HTTPS
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
