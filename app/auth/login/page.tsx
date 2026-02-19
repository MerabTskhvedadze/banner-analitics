"use client";

import { useState } from "react";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";

import {
  Form,
  Input,
  Button,
  Divider,
  Checkbox,
  Typography
} from "antd";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <header className="mb-10">
        <Typography.Title level={2} className="mb-1!">
          Log in to your account
        </Typography.Title>
        <Typography.Text type="secondary">
          Welcome back - enter your details to continue.
        </Typography.Text>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button className="font-medium!" icon={<FcGoogle className="text-xl" />}>
          Google
        </Button>

        <Button
          className="font-medium!"
          icon={<BsLinkedin className="text-primary! text-lg" />}
        >
          LinkedIn
        </Button>
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
          <Button type="primary" htmlType="submit" size="large" block>
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