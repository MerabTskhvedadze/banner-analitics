"use client";

import { useState } from "react";
import Link from "next/link";

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

import {
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

export default function SignupPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onFinish = (values: any) => {
    console.log(values);
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
          <Input
            size="large"
            placeholder="Min. 8 characters"
            type={showPassword ? "text" : "password"}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                style={{ background: "transparent", border: 0, padding: 0 }}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
              </button>
            }
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
          <Input
            size="large"
            placeholder="Re-enter your password"
            type={showConfirmPassword ? "text" : "password"}
            suffix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                style={{ background: "transparent", border: 0, padding: 0 }}
              >
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
              </button>
            }
            className="bg-transparent dark:text-white"
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
          <Button type="primary" htmlType="submit" size="large" block>
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