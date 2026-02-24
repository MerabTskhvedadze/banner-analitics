import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Prevent redirect loops: don't process OAuth-error redirect logic on the error page itself
  if (url.pathname !== "/auth/error") {
    const error = url.searchParams.get("error");
    const errorCode = url.searchParams.get("error_code");
    const errorDescription = url.searchParams.get("error_description");

    // Only redirect when it looks like an OAuth provider error response
    if (error || errorCode) {
      const dest = new URL("/auth/error", request.url);
      dest.searchParams.set("provider", "oauth");
      if (error) dest.searchParams.set("error", error);
      if (errorCode) dest.searchParams.set("error_code", errorCode);
      if (errorDescription) dest.searchParams.set("error_description", errorDescription);

      return NextResponse.redirect(dest);
    }
  }

  // IMPORTANT: still run updateSession for /auth/login, /auth/signup, etc.
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


// import { type NextRequest } from 'next/server'
// import { updateSession } from '@/lib/supabase/proxy'

// export async function proxy(request: NextRequest) {
//   return updateSession(request)
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }