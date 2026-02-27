import test from "node:test";
import assert from "node:assert/strict";
import { getResetVerificationPayload, hasRecoveryTypeMarker, isSafeRecoveryType } from "../lib/auth/reset-flow.ts";

test("uses PKCE code when code query param exists", () => {
  const payload = getResetVerificationPayload("https://example.com/auth/reset-callback?code=abc123");
  assert.deepEqual(payload, { kind: "code", code: "abc123" });
});

test("supports token_hash recovery links", () => {
  const payload = getResetVerificationPayload(
    "https://example.com/auth/reset-callback?token_hash=hash123&type=recovery"
  );
  assert.deepEqual(payload, { kind: "token_hash", tokenHash: "hash123", type: "recovery" });
});

test("normalizes token recovery links into token_hash verification payload", () => {
  const payload = getResetVerificationPayload(
    "https://example.com/auth/reset-callback?token=pkce_123&type=recovery"
  );
  assert.deepEqual(payload, { kind: "token_hash", tokenHash: "pkce_123", type: "recovery" });
});

test("supports token in URL hash for implicit callback", () => {
  const payload = getResetVerificationPayload(
    "https://example.com/auth/reset-callback#token=pkce_123&type=recovery"
  );
  assert.deepEqual(payload, { kind: "token_hash", tokenHash: "pkce_123", type: "recovery" });
});

test("rejects non recovery token types", () => {
  const payload = getResetVerificationPayload(
    "https://example.com/auth/reset-callback?token_hash=hash123&type=magiclink"
  );
  assert.equal(payload, null);
  assert.equal(isSafeRecoveryType("magiclink"), false);
});

test("detects recovery marker from query and hash", () => {
  assert.equal(hasRecoveryTypeMarker("https://example.com/auth/reset-callback?type=recovery"), true);
  assert.equal(hasRecoveryTypeMarker("https://example.com/auth/reset-callback#type=recovery"), true);
  assert.equal(hasRecoveryTypeMarker("https://example.com/auth/reset-callback"), false);
});
