const PUBLIC_WHEN_LOGGED_OUT = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",

  // “internal” routes that must stay reachable for flows to work
  "/auth/check-email",
  "/auth/callback",
  "/auth/error",
  "/auth/reset-callback",
];

// Pages that should remain reachable even when logged-in + AAL2
const ALLOW_WHEN_LOGGED_IN = [
  "/auth/reset-password",
  "/auth/reset-callback",
  "/auth/signout",
  "/auth/error",
];

// When needsStepUp=true (AAL1), only allow the step-up page (+ signout / internal)
const ALLOW_DURING_STEP_UP = [
  "/auth/2fa",
  "/auth/signout",
  "/auth/error",
  "/auth/reset-callback", // optional but safe
];

export function getAuthRedirectPath({
  pathname,
  hasUser,
  needsStepUp,
}: {
  pathname: string;
  hasUser: boolean;
  needsStepUp: boolean;
}) {
  const isAuthRoute = pathname.startsWith("/auth/");
  const isPublicLoggedOut = PUBLIC_WHEN_LOGGED_OUT.some((p) => pathname.startsWith(p));
  const allowWhenLoggedIn = ALLOW_WHEN_LOGGED_IN.some((p) => pathname.startsWith(p));
  const allowDuringStepUp = ALLOW_DURING_STEP_UP.some((p) => pathname.startsWith(p));

  if (!hasUser) {
    // Block all non-auth pages
    if (!isAuthRoute) return "/auth/login";

    // Allow only the public logged-out set
    if (isPublicLoggedOut) return null;

    // Special case: allow direct hit to reset-password; the page itself checks session and bounces safely
    if (pathname.startsWith("/auth/reset-password")) return null;

    // Everything else under /auth -> login
    return "/auth/login";
  }

  // 2) AAL1 (step-up required)
  if (needsStepUp) {
    // Only allow /auth/2fa (+ signout/internal)
    if (allowDuringStepUp) return null;
    return "/auth/2fa";
  }

  // 3) AAL2
  if (isAuthRoute) {
    // Allow reset flow even when logged in
    if (allowWhenLoggedIn) return null;

    // Otherwise, logged-in users shouldn’t see login/signup/etc
    return "/dashboard";
  }

  return null;
}
