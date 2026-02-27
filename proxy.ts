import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Only handle provider errors on the OAuth callback route
  const isOAuthCallback = url.pathname.startsWith("/auth/callback");

  if (isOAuthCallback && url.pathname !== "/auth/error") {
    const error = url.searchParams.get("error");
    const errorCode = url.searchParams.get("error_code");
    const errorDescription = url.searchParams.get("error_description");

    if (error || errorCode) {
      const dest = new URL("/auth/error", request.url);
      dest.searchParams.set("provider", "oauth");
      if (error) dest.searchParams.set("error", error);
      if (errorCode) dest.searchParams.set("error_code", errorCode);
      if (errorDescription) dest.searchParams.set("error_description", errorDescription);
      return NextResponse.redirect(dest);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};