import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // 1) Catch OAuth errors anywhere (or limit to "/" if you prefer)
  // Avoid looping if we're already on the error page.
  if (url.pathname !== "/auth/error") {
    const error = url.searchParams.get("error");
    const errorCode =
      url.searchParams.get("error_code") || url.searchParams.get("code");
    const errorDescription =
      url.searchParams.get("error_description") || url.searchParams.get("error_message");

    // Only redirect when it looks like an OAuth error response
    if (error || errorCode) {
      const dest = url.clone();
      dest.pathname = "/auth/error";
      // Keep the query params so your page can show a message
      // Add provider if you want (optional)
      if (!dest.searchParams.get("provider")) {
        dest.searchParams.set("provider", "oauth");
      }
      return NextResponse.redirect(dest);
    }
  }

  // 2) Otherwise continue your existing logic
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};