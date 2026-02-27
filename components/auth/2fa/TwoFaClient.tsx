"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Spin, Typography, message } from "antd";
import { createClient } from "@/lib/supabase/client";
import { MinusOutlined } from "@ant-design/icons";

export default function TwoFAClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  console.log(otpCode);


  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        router.replace("/auth/login");
        return;
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aal?.nextLevel !== "aal2") {
        router.replace(nextPath);
        return;
      }
      if (aal?.currentLevel === "aal2") {
        router.replace(nextPath);
        return;
      }

      const { data: factors, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        message.error("Could not load 2FA methods.");
        router.replace("/auth/login");
        return;
      }

      const totpList: any[] = (factors as any)?.totp ?? [];
      const verified = totpList.find((f: any) => f.status === "verified");

      if (!verified?.id) {
        message.error("No authenticator is enrolled. Enable 2FA in Security settings first.");
        await supabase.auth.signOut();
        router.replace("/settings/security");
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
    return (
      <main className="w-fit mx-auto">
        <Spin size="large" />
      </main>
    )
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Two-factor authentication</h2>
        <p className="text-slate-500 mb-6">Enter the 6-digit code from your authenticator app.</p>

        <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
          <Form.Item name="code" rules={[{ required: true, message: "Enter your code." }]}>
            <Input.OTP
              inputMode="numeric"
              autoComplete="one-time-code"
              length={6}
              className="mt-2!"
              type="input"
              size="large"
              separator={(i) => i === 2 ? <MinusOutlined /> : null}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Verify
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <Typography.Link
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.replace("/auth/login");
            }}
          >
            Cancel and sign out
          </Typography.Link>
        </div>
      </div>
    </main>
  );
}