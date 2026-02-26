"use client";

import { useState } from "react";
import { Button, Form, Input, Typography, message, Space, App } from "antd";
import { MdArrowBack } from "react-icons/md";
import { requestPasswordReset } from "@/components/auth/actions";

type FormValues = {
  email: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }: FormValues) => {
    setLoading(true)
    const res = await requestPasswordReset({ email });
    if (res.ok) message.success(res.message);
    else message.error(res.message);
    setLoading(false)
  };

  return (
    <App>
      <main className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-background-dark p-6">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h2 className="text-3xl font-bold mb-3 dark:text-white">Forgot your password?</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter your email and we’ll send a link to reset your password.
            </p>
          </header>

          <Form<FormValues>
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label={<span className="font-semibold dark:text-slate-200">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Please enter a valid email address." },
              ]}
            >
              <Input size="large" placeholder="you@example.com" autoComplete="email" />
            </Form.Item>

            <Form.Item className="mt-2">
              <Button size="large" type="primary" htmlType="submit" loading={loading} block>
                Send reset link
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
    </App>
  );
}