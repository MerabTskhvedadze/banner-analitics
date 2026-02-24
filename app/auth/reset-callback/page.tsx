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

      // This reads tokens from the URL (including hash) and creates a session when possible.
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
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