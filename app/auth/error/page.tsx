"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function friendlyMessage(error: string | null, errorCode: string | null) {
  // Common OAuth-ish cases across providers
  const code = (errorCode || "").toLowerCase();
  const err = (error || "").toLowerCase();

  // "state invalid/missing/expired" variants
  if (
    code.includes("state") ||
    err.includes("state") ||
    code.includes("csrf") ||
    err.includes("csrf")
  ) {
    return "That sign-in attempt expired (often from using the Back button or opening multiple tabs). Please try signing in again.";
  }

  // user cancelled / denied
  if (err.includes("access_denied") || code.includes("access_denied") || err.includes("user_cancel")) {
    return "Sign-in was cancelled. You can try again whenever you’re ready.";
  }

  return "Sign-in didn’t complete. Please try again.";
}

function AuthErrorContent() {
  const params = useSearchParams();
  const router = useRouter();

  const provider = params.get("provider"); // optional
  const error = params.get("error");
  const errorCode = params.get("error_code") || params.get("code"); // some providers use `code` for error code
  const errorDescription = params.get("error_description") || params.get("error_message");

  const message = friendlyMessage(error, errorCode);

  // (Optional) show a tiny bit more detail in dev only
  const details =
    process.env.NODE_ENV !== "production"
      ? decodeURIComponent(errorDescription || "")
      : "";

  return (
    <main style={{ padding: 24 }}>
      <h1>Sign-in error{provider ? ` (${provider})` : ""}</h1>
      <p>{message}</p>
      {details ? <p style={{ opacity: 0.7 }}>{details}</p> : null}

      <button onClick={() => router.replace("/auth/login")}>Back to login</button>
    </main>
  );
}


export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  )
}