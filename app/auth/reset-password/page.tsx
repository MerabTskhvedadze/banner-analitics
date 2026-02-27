"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Space, Spin } from "antd";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setNewPassword } from "@/lib/user-actions";

type FormValues = { password: string; confirm: string };

export default function Page() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        await supabase.auth.signOut({ scope: "local" });
        message.error("This reset link is invalid or expired. Please request a new one.");
        router.replace("/auth/forgot-password?error=expired");
        return;
      }
      setReady(true);
    };
    check();
  }, [router]);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    const res = await setNewPassword(values);
    if (res?.ok === false) message.error(res.message);
    setLoading(false);
  };

  if (!ready) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <Spin size="large" />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-background-dark p-6">
      <div className="w-full max-w-md">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-3 dark:text-white">Reset your password</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Choose a new password for your account.
          </p>
        </header>

        <Form<FormValues> layout="vertical" requiredMark={false} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label={<span className="font-semibold dark:text-slate-200">New password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter a new password." },
              { min: 8, message: "Password must be at least 8 characters." },
            ]}
          >
            <Input.Password size="large" placeholder="Min. 8 characters" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold dark:text-slate-200">Confirm new password</span>}
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your new password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Re-enter your password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item className="mt-2">
            <Button loading={loading} size="large" type="primary" htmlType="submit" block>
              Update password
            </Button>
          </Form.Item>
        </Form>

        <footer className="mt-8 text-center text-sm">
          <Space>
            <Typography.Link href="/auth/login" className="inline-flex items-center gap-1">
              <MdArrowBack className="text-lg" />
              Back to login
            </Typography.Link>
          </Space>
        </footer>
      </div>
    </main>
  );
}
