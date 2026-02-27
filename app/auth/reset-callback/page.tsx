"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { createClient } from "@/lib/supabase/client";
import { getResetVerificationPayload, hasRecoveryTypeMarker } from "@/lib/auth/reset-flow";

const RESET_LINK_ERROR_MESSAGE = "This reset link is invalid or expired. Please request a new one.";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const payload = getResetVerificationPayload(window.location.href);
      const hasRecoveryMarker = hasRecoveryTypeMarker(window.location.href);

      const failExpired = async () => {
        await supabase.auth.signOut({ scope: "local" });
        message.error(RESET_LINK_ERROR_MESSAGE);
        router.replace("/auth/forgot-password?error=expired");
      };

      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.info("[reset-callback] starting", {
          requestPath: window.location.pathname,
          branch: payload?.kind ?? "missing-token",
          hasRecoveryMarker,
        });
      }

      if (payload?.kind === "code") {
        const { error } = await supabase.auth.exchangeCodeForSession(payload.code);
        if (error) {
          await failExpired();
          return;
        }
      }

      if (payload?.kind === "token_hash") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: payload.tokenHash,
          type: payload.type,
        });

        if (error) {
          await failExpired();
          return;
        }
      }

      if (payload?.kind === "token" && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.info("[reset-callback] token flow detected", { hasToken: true });
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session || (!payload && !hasRecoveryMarker)) {
        await failExpired();
        return;
      }

      router.replace("/auth/reset-password");
    };

    run();
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <p>Opening reset password…</p>
    </main>
  );
}
