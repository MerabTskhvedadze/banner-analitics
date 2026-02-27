const publicWhenLoggedOut = [
  '/auth/login',
  '/auth/signup',
  '/auth/check-email',
  '/auth/callback',
  '/auth/error',
  '/auth/reset-callback',
  '/auth/reset-password',
  '/auth/forgot-password',
];

const allowedDuringStepUp = [
  '/auth/2fa',
  '/auth/signout',
  '/auth/reset-callback',
  '/auth/reset-password',
  '/auth/forgot-password',
  '/auth/login',
];

export function getAuthRedirectPath({ pathname, hasUser, needsStepUp }) {
  const isPublic = publicWhenLoggedOut.some((p) => pathname.startsWith(p));
  const isAuthRoute = pathname.startsWith('/auth/');
  const is2faPage = pathname.startsWith('/auth/2fa');

  if (!hasUser) {
    if (is2faPage || (!isPublic && !isAuthRoute)) {
      return '/auth/login';
    }
    if (isPublic) return null;
    if (isAuthRoute) return '/auth/login';
    return null;
  }

  if (needsStepUp) {
    const allowed = allowedDuringStepUp.some((p) => pathname.startsWith(p));
    if (!allowed) return '/auth/2fa';
    return null;
  }

  if (isAuthRoute) {
    return '/dashboard';
  }

  return null;
}
