import test from 'node:test';
import assert from 'node:assert/strict';
import { getResetVerificationPayload, isSafeRecoveryType } from '../lib/auth/reset-flow.ts';

test('uses PKCE code when code query param exists', () => {
  const payload = getResetVerificationPayload('https://example.com/auth/reset-callback?code=abc123');
  assert.deepEqual(payload, { kind: 'code', code: 'abc123' });
});

test('supports token_hash recovery links', () => {
  const payload = getResetVerificationPayload('https://example.com/auth/reset-callback?token_hash=hash123&type=recovery');
  assert.deepEqual(payload, { kind: 'otp', tokenHash: 'hash123', type: 'recovery' });
});

test('rejects non recovery token types', () => {
  const payload = getResetVerificationPayload('https://example.com/auth/reset-callback?token_hash=hash123&type=magiclink');
  assert.equal(payload, null);
  assert.equal(isSafeRecoveryType('magiclink'), false);
});
