"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input, Typography, message } from "antd";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/components/auth/actions";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  const nextPath = useMemo(() => {
    const n = params.get("next");
    return n && n.startsWith("/") ? n : "/dashboard";
  }, [params]);

  const [factorId, setFactorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        router.replace("/auth/login");
        return;
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      // If MFA isn't required, user shouldn't be here
      if (aal?.nextLevel !== "aal2") {
        router.replace(nextPath);
        return;
      }

      // If already AAL2, continue
      if (aal?.currentLevel === "aal2") {
        router.replace(nextPath);
        return;
      }

      // Find a verified TOTP factor to challenge
      const { data: factors, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        message.error("Could not load 2FA methods.");
        router.replace("/auth/login");
        return;
      }

      const totpList: any[] = (factors as any)?.totp ?? [];
      const verified = totpList.find((f: any) => f.status === "verified");

      if (!verified?.id) {
        // They are required to do MFA but have no verified factor -> send to settings enrollment page
        message.error("2FA setup is required, but no authenticator is enrolled. Please enroll 2FA first.");
        router.replace("/settings/security"); // create this page for enrollment
        signOut()
        return;
      }

      setFactorId(verified.id);
      setReady(true);
    };

    init();
  }, [router, nextPath]);

  const onFinish = async (values: { code: string }) => {
    if (!factorId) return;

    const code = (values.code || "").trim();
    if (!/^\d{6}$/.test(code)) {
      message.error("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // This performs challenge + verify for TOTP
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) {
        message.error(error.message || "Invalid code.");
        return;
      }

      router.replace(nextPath);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (<></>);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Two-factor authentication</h2>
        <p className="text-slate-500 mb-6">Enter the 6-digit code from your authenticator app.</p>

        <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
          <Form.Item label="Code" name="code" rules={[{ required: true, message: "Enter your code." }]}>
            <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Verify
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <Typography.Link
            onClick={signOut}
          >
            Cancel and sign out
          </Typography.Link>
        </div>
      </div>
    </main>
  );
}