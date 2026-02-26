
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  const user = claimsData?.claims ?? null;

  // Logged-out public routes (no /auth/2fa)
  const publicWhenLoggedOut = [
    "/auth/login",
    "/auth/signup",
    "/auth/check-email",
    "/auth/callback",
    "/auth/error",
    "/auth/reset-callback",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const isPublicWhenLoggedOut = publicWhenLoggedOut.some((p) => pathname.startsWith(p));
  const isAuthRoute = pathname.startsWith("/auth/");
  const is2faPage = pathname.startsWith("/auth/2fa");

  // 1) Logged out
  if (!user) {
    if (is2faPage || (!isPublicWhenLoggedOut && !pathname.startsWith("/auth/"))) {
      // If it's not one of the allowed public auth pages, send to login.
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      if (!isPublicWhenLoggedOut) url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // If it is a public auth page, allow.
    if (isPublicWhenLoggedOut) return supabaseResponse;

    // Any other /auth/* route should go to login as well
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // 2) Logged in -> check AAL
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const needsStepUp = aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2";

  // 2a) Step-up required: lock them into /auth/2fa (plus optional signout)
  const allowedDuringStepUp = ["/auth/2fa", "/auth/signout"];
  const isAllowedDuringStepUp = allowedDuringStepUp.some((p) => pathname.startsWith(p));

  if (needsStepUp) {
    if (!isAllowedDuringStepUp) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/2fa";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 2b) Step-up NOT required:
  // - keep user out of ALL /auth/* pages (including /auth/2fa)
  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // - normal protected routing: if they are logged in, allow
  return supabaseResponse;
}



// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
//           supabaseResponse = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   const pathname = request.nextUrl.pathname;

//   // Session/claims
//   const { data: claimsData } = await supabase.auth.getClaims();
//   const user = claimsData?.claims ?? null;

//   // Pages that are OK when logged OUT
//   const publicWhenLoggedOut = [
//     "/auth/login",
//     "/auth/signup",
//     "/auth/check-email",
//     "/auth/callback",
//     "/auth/error",
//     "/auth/reset-callback",
//     "/auth/reset-password",
//     "/auth/forgot-password",
//   ];

//   const isPublicWhenLoggedOut = publicWhenLoggedOut.some((p) => pathname.startsWith(p));
//   const is2faPage = pathname.startsWith("/auth/2fa");

//   // 1) Logged out -> allow only public auth pages (NOT /auth/2fa)
//   if (!user) {
//     if (is2faPage || !isPublicWhenLoggedOut) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/auth/login";
//       // optional: preserve destination for after login
//       if (!isPublicWhenLoggedOut) url.searchParams.set("next", pathname);
//       return NextResponse.redirect(url);
//     }
//     return supabaseResponse;
//   }

//   // 2) Logged in -> check assurance level
//   const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
//   const needsStepUp = aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2";

//   // While step-up is required, only allow /auth/2fa (and optionally signout)
//   const allowedDuringStepUp = [
//     "/auth/2fa",
//     "/auth/signout", // if you have one; otherwise remove
//   ];
//   const isAllowedDuringStepUp = allowedDuringStepUp.some((p) => pathname.startsWith(p));

//   if (needsStepUp && !isAllowedDuringStepUp) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/auth/2fa";
//     url.searchParams.set("next", pathname);
//     return NextResponse.redirect(url);
//   }

//   // If step-up NOT required, keep user away from /auth/2fa
//   if (!needsStepUp && is2faPage) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }

//   return supabaseResponse;
// }



// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options)
//           })
//         },
//       },
//     }
//   )

//   const pathname = request.nextUrl.pathname

//   // 1) identify if user has a session at all
//   const { data: claimsData } = await supabase.auth.getClaims()
//   const user = claimsData?.claims

//   // 2) compute AAL (if there is a session)
//   let currentLevel: "aal1" | "aal2" | null = null
//   if (user) {
//     const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
//     currentLevel = aal?.currentLevel ?? null
//   }

//   const publicPrefixes = [
//     "/auth/login",
//     "/auth/signup",
//     "/auth/check-email",
//     "/auth/callback",
//     "/auth/error",
//     "/auth/reset-callback",
//     "/auth/reset-password",
//     "/auth/forgot-password",
//     "/auth/2fa",
//   ];

//   const isPublic = publicPrefixes.some((p) => pathname.startsWith(p));

//   if (!user && !isPublic) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/auth/login";
//     return NextResponse.redirect(url);
//   }

//   if (user && !isPublic) {
//     const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

//     // Only require 2FA if Supabase says the next level is AAL2
//     if (aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2") {
//       const url = request.nextUrl.clone();
//       url.pathname = "/auth/2fa";
//       url.searchParams.set("next", pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   return supabaseResponse
// }