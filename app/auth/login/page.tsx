"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { signIn } from "@/lib/user-actions";

import { FcGoogle } from "react-icons/fc";

import {
  Form,
  Input,
  Button,
  Divider,
  Checkbox,
  Typography
} from "antd";
import { LinkedInButton } from "@/components/auth/LinkedInButton";
import { MdError } from "react-icons/md";

function LoginPageContent() {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)
  
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    setLoginError(null);
    
    const res = await signIn({
      ...values,
      next,
    });

    // If signIn redirected, code below won't run (redirect throws internally)
    if (res?.ok === false) {
      setLoginError(res.message);
    }
    setLoading(false)
  };

  return (
    <>
      {loginError &&
        <div className=" shadow-2xs mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3 items-start">
          <MdError className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg" />

          <div className="text-sm text-red-800 dark:text-red-300">
            <Typography.Title
              level={5}
              type='danger'
              className="mb-0!"
            >
              Invalid credentials
            </Typography.Title>

            <Typography.Text type='danger'>Please try again or reset your password.</Typography.Text>
          </div>
        </div>
      }

      <header className="mb-10">
        <Typography.Title level={2} className="mb-1!">
          Log in to your account
        </Typography.Title>
        <Typography.Text type="secondary">
          Welcome back - enter your details to continue.
        </Typography.Text>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button disabled className="font-medium!" icon={<FcGoogle className="text-xl" />}>
          Google Soon
        </Button>

        <LinkedInButton next={next} />
      </div>

      <Divider>Or continue with email</Divider>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-5!"
      >
        <Form.Item
          label={
            <Typography.Text className="font-semibold dark:text-slate-200">
              Work Email
            </Typography.Text>
          }
          name="email"
          rules={[
            { required: true, message: "Please enter your work email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input size="large" placeholder="name@company.com" />
        </Form.Item>

        <Form.Item
          label={
            <Typography.Text className="block font-semibold dark:text-slate-200">
              Password
            </Typography.Text>
          }
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Your password"
            visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
            className="bg-transparent dark:text-white"
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" className="mb-0!">
            <Checkbox className="dark:text-slate-400">Remember me</Checkbox>
          </Form.Item>

          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Form.Item className="mb-0">
          <Button loading={loading} type="primary" htmlType="submit" size="large" block>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <footer className="mt-4 text-center text-sm">
        <Typography.Text type="secondary">
          Don&apos;t have an account?
        </Typography.Text>{" "}
        <Typography.Link href="/auth/signup">Create one</Typography.Link>
      </footer>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
