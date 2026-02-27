import test from 'node:test';
import assert from 'node:assert/strict';
import { getAuthRedirectPath } from '../lib/auth/auth-routing.ts';

test('step-up does not hijack reset recovery routes', () => {
  const redirect = getAuthRedirectPath({
    pathname: '/auth/reset-callback',
    hasUser: true,
    needsStepUp: true,
  });

  assert.equal(redirect, null);
});

test('logged out users can visit login page', () => {
  const redirect = getAuthRedirectPath({
    pathname: '/auth/login',
    hasUser: false,
    needsStepUp: false,
  });

  assert.equal(redirect, null);
});
