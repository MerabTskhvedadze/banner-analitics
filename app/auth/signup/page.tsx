"use client";

import { useState } from "react";
import Link from "next/link";

import { signUp } from '@/components/auth/actions'

import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";

import {
  Form,
  Input,
  Select,
  Button,
  Divider,
  Checkbox,
  Typography,
} from "antd";

export default function SignupPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    const res = await signUp(values);
    if (res?.ok === false) {
      console.log(res)
    }
    setLoading(false)
  };

  return (
    <>
      <header className="mb-10">
        <Typography.Title level={2} className="mb-1!">
          Create your account
        </Typography.Title>
        <Typography.Text type="secondary">
          Start your 14-day free trial today.
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
            { required: true, message: "Please enter a password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
          hasFeedback
        >
          <Input.Password
            size="large"
            placeholder="Min. 8 characters"
            visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
            className="bg-transparent dark:text-white"
          />
        </Form.Item>

        {/* Re-enter password */}
        <Form.Item
          label={
            <Typography.Text className="block font-semibold dark:text-slate-200">
              Re-enter Password
            </Typography.Text>
          }
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please re-enter your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const password = getFieldValue("password");
                if (!value || value === password) return Promise.resolve();
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Re-enter your password"
            className="bg-transparent dark:text-white"
            visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Typography.Text className="block font-semibold dark:text-slate-200">
              I am a...
            </Typography.Text>
          }
          name="profession"
        >
          <Select
            size="large"
            placeholder="Select your profession"
            options={[
              { value: "creator", label: "Content Creator" },
              { value: "marketer", label: "Marketer" },
              { value: "designer", label: "Graphic Designer" },
              { value: "agency", label: "Agency Owner" },
              { value: "other", label: "Other" },
            ]}
            className="bg-transparent"
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("You must agree to the terms")),
            },
          ]}
        >
          <Checkbox className="dark:text-slate-400">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              .
            </span>
          </Checkbox>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button loading={loading} type="primary" htmlType="submit" size="large" block>
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <footer className="mt-1 text-center text-sm">
        <Typography.Text type="secondary">
          Already have an account?
        </Typography.Text>{" "}
        <Typography.Link href="/auth/login">Log in</Typography.Link>
      </footer>
    </>
  );
}