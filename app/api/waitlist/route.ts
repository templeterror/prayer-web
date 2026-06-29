import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Service-role insert must run on Node, never edge.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email).trim()
      : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("waitlist").insert({ email: email.toLowerCase() });

  if (error) {
    // 23505 = unique_violation → already on the list. Treat as success so we
    // don't leak which emails exist and the user sees the same confirmation.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true });
    }
    console.error("[waitlist] insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
