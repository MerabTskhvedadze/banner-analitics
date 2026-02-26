"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      const sp = new URLSearchParams(window.location.search);
      const code = sp.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          message.error("This reset link is invalid or expired. Please request a new one.");
          router.replace("/auth/forgot-password?error=expired");
          return;
        }

        router.replace("/auth/reset-password");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        message.error("This reset link is invalid or expired. Please request a new one.");
        router.replace("/auth/forgot-password?error=expired");
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