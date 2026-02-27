import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthRedirectPath } from "@/lib/auth/auth-routing";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const { data: claimsData } = await supabase.auth.getClaims();
  const hasUser = Boolean(claimsData?.claims);

  let needsStepUp = false;
  if (hasUser) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsStepUp = aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2";
  }

  const redirectPath = getAuthRedirectPath({ pathname, hasUser, needsStepUp });

  if (redirectPath) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;

    if (redirectPath === "/auth/login" && !pathname.startsWith("/auth/")) {
      url.searchParams.set("next", pathname);
    }

    if (redirectPath === "/auth/2fa") {
      url.searchParams.set("next", pathname);
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
