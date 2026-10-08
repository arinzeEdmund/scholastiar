import { NextResponse, type NextRequest } from "next/server";

import { repos } from "@/data";
import { notify } from "@/lib/messages/notify";

/** Target of the link in the verification email. Uses up the token, then shows the result. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const userId = token ? await repos.auth.consumeToken(token, "verify_email") : null;
  if (userId) {
    await repos.auth.markEmailVerified(userId);
    await notify("email.verified", { userId });
  }
  const status = userId ? "verified" : "invalid";
  return NextResponse.redirect(new URL(`/auth/verify-email?status=${status}`, request.url));
}
