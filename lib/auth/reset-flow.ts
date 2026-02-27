export function isSafeRecoveryType(type) {
  return type === 'recovery';
}

export function getResetVerificationPayload(urlValue) {
  const url = new URL(urlValue);
  const code = url.searchParams.get('code');
  if (code) {
    return { kind: 'code', code };
  }

  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');

  if (tokenHash && isSafeRecoveryType(type)) {
    return { kind: 'otp', tokenHash, type: 'recovery' };
  }

  return null;
}
