"use client";

import React, { useMemo, useState } from "react";
import PageHeader from "@/components/settings/PageHeader";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Switch,
  Typography,
  Tooltip,
  message,
  // theme,
} from "antd";
import { MdContentCopy, MdKey, MdRefresh } from "react-icons/md";

const { Title, Text, Link } = Typography;

export default function Page() {
  // const { token } = theme.useToken();

  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const recoveryCodes = useMemo(
    () => [
      { value: "8x91-2a3b", used: false },
      { value: "7c8d-1e2f", used: false },
      { value: "4g5h-6i7j", used: false },
      { value: "1k2l-3m4n", used: true },
      { value: "5o6p-7q8r", used: false },
      { value: "9s0t-1u2v", used: false },
      { value: "3w4x-5y6z", used: false },
      { value: "7a8b-9c0d", used: false },
    ],
    []
  );

  const onDigitChange = (idx: number, raw: string) => {
    const v = (raw || "").replace(/\s/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });

    // auto-focus next
    if (v && idx < 5) {
      const nextEl = document.getElementById(`otp-${idx + 1}`) as HTMLInputElement | null;
      nextEl?.focus();
    }
  };

  const onDigitKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      const prevEl = document.getElementById(`otp-${idx - 1}`) as HTMLInputElement | null;
      prevEl?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      const prevEl = document.getElementById(`otp-${idx - 1}`) as HTMLInputElement | null;
      prevEl?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      const nextEl = document.getElementById(`otp-${idx + 1}`) as HTMLInputElement | null;
      nextEl?.focus();
    }
  };

  const otpValue = code.join("");

  const handleVerify = () => {
    if (otpValue.length !== 6) {
      message.warning("Enter the 6-digit code.");
      return;
    }
    message.success("Verified (demo). 2FA enabled.");
    setTwoFAEnabled(true);
  };

  const handleRefreshCodes = () => {
    message.info("Refresh recovery codes (wire this to your API).");
  };

  const handleCopyCodes = async () => {
    try {
      const text = recoveryCodes.map((c) => c.value + (c.used ? " (used)" : "")).join("\n");
      await navigator.clipboard.writeText(text);
      message.success("Recovery codes copied.");
    } catch {
      message.error("Could not copy. Your browser may block clipboard access.");
    }
  };

  return (
    <main style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <PageHeader
          title="Security Settings"
          subtitle="Manage your password and secure your account with 2FA."
        />
      </div>

      <Divider />

      <Card
        styles={{
          body: {
            padding: 24,
            // background: token.colorBgContainer,
          },
        }}
      >
        <Row justify="space-between" align="top" gutter={[16, 16]}>
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={5} style={{ margin: 0 }}>
                Two-Factor Authentication
              </Title>
              <Text type="secondary">
                Add an extra layer of security to your account.
              </Text>
            </Space>
          </Col>

          <Col>
            <Switch checked={twoFAEnabled} onChange={setTwoFAEnabled} />
          </Col>
        </Row>

        <Divider style={{ marginTop: 24, marginBottom: 24 }} />

        <Row gutter={[24, 24]} align="top">
          {/* QR */}
          <Col xs={24} md={8} lg={7}>
            <Card
              size="small"
              styles={{ body: { padding: 16 } }}
              style={{
                // background: token.colorBgContainer,
                // borderColor: token.colorBorderSecondary,
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 8,
                  overflow: "hidden",
                  // border: `1px solid ${token.colorBorderSecondary}`,
                  // background: token.colorBgElevated,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginInline: "auto",
                }}
              >
                <img
                  alt="QR Code for 2FA Setup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbwsPSRiOaUaDQ7e3fFfYr5uGtUJnS3zIZEmc6M0V8tbsgDz91vlx8yiU19HE-1Iv22O4qMjucwCq6Wcsw7YeaYdG0FcgMYNsATkt0zBVPHhKv3_gik3qL3EZTFYstYt98opVse8salz_BH8vPWmaYhw-Yx2i8Mw1QagCtB28zBcsOaUw76zFd-RGEVn365nC7qGU-YxVjVghb0wSMLsN3P0rppBy0eYWcZunu69TDpQzVXIZ4jcKYHEZ89ASf1HVhm8a0AZELIf69"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </Card>
          </Col>

          {/* Instructions + OTP */}
          <Col xs={24} md={16} lg={17}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Text strong>1. Scan QR Code</Text>
                <div>
                  <Text type="secondary">
                    Open your authenticator app (like Google Authenticator or Authy) and scan the QR
                    code.
                  </Text>
                </div>
              </div>

              <div>
                <Text strong>2. Enter Verification Code</Text>
                <div style={{ marginTop: 8 }}>
                  <Space size={8} wrap>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Input
                        key={idx}
                        id={`otp-${idx}`}
                        value={code[idx]}
                        onChange={(e) => onDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => onDigitKeyDown(idx, e)}
                        inputMode="numeric"
                        maxLength={1}
                        style={{
                          width: 48,
                          height: 48,
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: 18,
                        }}
                        placeholder="•"
                      />
                    ))}
                  </Space>
                </div>
              </div>

              <Space size={12} wrap>
                <Button type="primary" onClick={handleVerify}>
                  Verify &amp; Enable
                </Button>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Can't scan? <Link>Enter code manually</Link>
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Recovery Codes */}
        <Card
          style={{
            marginTop: 24,
            // background: token.colorFillAlter,
            // borderColor: token.colorBorderSecondary,
          }}
          styles={{ body: { padding: 16 } }}
        >
          <Row align="middle" justify="space-between" gutter={[12, 12]}>
            <Col flex="auto">
              <Space direction="vertical" size={4}>
                <Space align="center" size={8}>
                  <MdKey />
                  <Text strong>Recovery Codes</Text>
                </Space>
                <Text type="secondary">
                  Keep these codes safe. They are the only way to access your account if you lose
                  your device.
                </Text>
              </Space>
            </Col>
            <Col>
              <Button icon={<MdRefresh />} onClick={handleRefreshCodes}>
                Refresh
              </Button>
            </Col>
          </Row>

          <Divider style={{ margin: "16px 0" }} />

          <Row gutter={[12, 12]}>
            {recoveryCodes.map((c) => (
              <Col key={c.value} xs={12} md={6}>
                <div
                  title={c.used ? "Used" : undefined}
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    padding: "6px 10px",
                    borderRadius: 8,
                    // border: `1px solid ${token.colorBorderSecondary}`,
                    // background: token.colorBgContainer,
                    // color: c.used ? token.colorTextQuaternary : token.colorTextSecondary,
                    textDecoration: c.used ? "line-through" : "none",
                    userSelect: c.used ? "none" : "text",
                  }}
                >
                  {c.value}
                </div>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Copy all recovery codes">
              <Button type="link" icon={<MdContentCopy />} onClick={handleCopyCodes}>
                Copy to clipboard
              </Button>
            </Tooltip>
          </div>
        </Card>
      </Card>
    </main>
  );
}