export type ResetVerificationPayload =
  | { kind: "code"; code: string }
  | { kind: "token_hash"; tokenHash: string; type: "recovery" };

function getHashSearchParams(url: URL) {
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  return new URLSearchParams(hash);
}

export function isSafeRecoveryType(type: string | null): type is "recovery" {
  return type === "recovery";
}

export function hasRecoveryTypeMarker(urlValue: string) {
  const url = new URL(urlValue);
  const searchType = url.searchParams.get("type");
  if (isSafeRecoveryType(searchType)) return true;

  const hashParams = getHashSearchParams(url);
  const hashType = hashParams.get("type");
  return isSafeRecoveryType(hashType);
}

export function getResetVerificationPayload(urlValue: string): ResetVerificationPayload | null {
  const url = new URL(urlValue);
  const searchParams = url.searchParams;
  const hashParams = getHashSearchParams(url);

  const code = searchParams.get("code") ?? hashParams.get("code");
  if (code) {
    return { kind: "code", code };
  }

  const type = searchParams.get("type") ?? hashParams.get("type");
  if (!isSafeRecoveryType(type)) return null;

  const tokenHash =
    searchParams.get("token_hash") ??
    hashParams.get("token_hash") ??
    searchParams.get("token") ??
    hashParams.get("token");

  if (tokenHash) {
    return { kind: "token_hash", tokenHash, type: "recovery" };
  }

  return null;
}
