"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { createClient } from "@/lib/supabase/client";

const RESET_LINK_ERROR_MESSAGE =
  "This reset link is invalid or expired. Please request a new one.";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.replace("/auth/reset-password");
      }
    });

    // Fallback: if Supabase didn't establish a session from the URL, treat as invalid
    const t = window.setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        message.error(RESET_LINK_ERROR_MESSAGE);
        router.replace("/auth/forgot-password?error=expired");
      } else {
        router.replace("/auth/reset-password");
      }
    }, 1200);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <p>Opening reset password…</p>
    </main>
  );
}
