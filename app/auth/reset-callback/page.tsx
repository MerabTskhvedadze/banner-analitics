"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // Most Supabase recovery links include ?code=... in the URL
      const code = params.get("code");
      console.log(code);
      

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          // If you ever get AAL2-related text, handle it here
          if (error.message?.toLowerCase().includes("aal2")) {
            message.error(
              "This account has 2FA enabled. For security, password reset requires 2FA verification. Please sign in and change your password from settings (or contact support)."
            );
            router.replace("/auth/login");
            return;
          }

          message.error("This reset link is invalid or expired. Please request a new one.");
          router.replace("/auth/forgot-password?error=expired");
          return;
        }

        router.replace("/auth/reset-password");
        return;
      }

      // Fallback for older “hash token” style links
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        message.error("This reset link is invalid or expired. Please request a new one.");
        router.replace("/auth/forgot-password?error=expired");
        return;
      }

      router.replace("/auth/reset-password");
    };

    run();
  }, [router, params]);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <p>Opening reset password…</p>
    </main>
  );
}