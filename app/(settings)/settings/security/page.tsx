"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/settings/PageHeader";
import {
  Row,
  Col,
  Card,
  Space,
  Button,
  Switch,
  Divider,
  Tooltip,
  message,
  Typography,
  App,
} from "antd";
import { MdKey, MdRefresh, MdContentCopy } from "react-icons/md";
import type { GetProps } from "antd";
import { Input } from "antd";
import { createClient } from "@/lib/supabase/client";

type OTPProps = GetProps<typeof Input.OTP>;
const { Title, Text, Link } = Typography;

type Phase = "idle" | "enrolling" | "verifying" | "enabled" | "disabling";

export default function Page() {
  const supabase = useMemo(() => createClient(), []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  // Demo-only UI you had; Supabase doesn’t provide these
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

  const onChange: OTPProps["onChange"] = (text) => setOtpCode(text);

  // Load current factor status on mount
  useEffect(() => {
    const load = async () => {
      // Must be logged in to manage MFA factors
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        message.error("Please sign in to manage security settings.");
        return;
      }

      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        message.error("Could not load 2FA status.");
        return;
      }

      const totpList: any[] = (data as any)?.totp ?? [];
      const verified = totpList.find((f: any) => f.status === "verified");
      const unverified = totpList.find((f: any) => f.status !== "verified");

      if (verified?.id) {
        setTwoFAEnabled(true);
        setFactorId(verified.id);
        setPhase("enabled");
        setQrCode(null);
        setUri(null);
        return;
      }

      // If an unverified enrollment exists, let them finish it
      if (unverified?.id) {
        setTwoFAEnabled(false);
        setFactorId(unverified.id);
        // If your SDK returns totp data only on enroll(), you may not have qr/uri here.
        // In that case, you should re-enroll (or store qr/uri when first enrolling).
        setPhase("enrolling");
        return;
      }

      // no factors
      setTwoFAEnabled(false);
      setFactorId(null);
      setPhase("idle");
      setQrCode(null);
      setUri(null);
    };

    load();
  }, [supabase]);

  const startEnroll = async () => {
    setPhase("enrolling");
    setOtpCode("");
    setQrCode(null);
    setUri(null);

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator app",
    });

    if (error || !data?.id) {
      setPhase("idle");
      setTwoFAEnabled(false);
      setFactorId(null);
      message.error(error?.message || "Could not start 2FA setup.");
      return;
    }

    setFactorId(data.id);
    setQrCode(data.totp?.qr_code ?? null);
    setUri(data.totp?.uri ?? null);

    // User must now verify with a code to finish enabling
    message.info("Scan the QR code and enter the 6-digit code to enable 2FA.");
  };

  const verifyEnroll = async () => {
    if (!factorId) {
      message.error("Missing 2FA setup state. Please toggle 2FA again.");
      setPhase("idle");
      return;
    }

    const code = otpCode.trim();
    if (!/^\d{6}$/.test(code)) {
      message.warning("Enter the 6-digit code.");
      return;
    }

    setPhase("verifying");
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });

    if (error) {
      setPhase("enrolling");
      message.error(error.message || "Invalid code. Please try again.");
      return;
    }

    // Verified -> enabled
    setTwoFAEnabled(true);
    setPhase("enabled");
    setQrCode(null);
    setUri(null);
    setOtpCode("");

    message.success("2FA enabled.");
  };

  const disable2FA = async () => {
    // Need the verified factor id to unenroll
    if (!factorId) {
      message.error("Could not find your 2FA factor.");
      return;
    }

    setPhase("disabling");
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) {
      setPhase("enabled");
      setTwoFAEnabled(true);
      message.error(error.message || "Could not disable 2FA.");
      return;
    }

    setTwoFAEnabled(false);
    setFactorId(null);
    setPhase("idle");
    message.success("2FA disabled.");
  };

  const onToggle = async (checked: boolean) => {
    // If currently enabled and user toggles off -> unenroll
    if (!checked) {
      // keep switch visually on until we succeed
      if (twoFAEnabled) {
        await disable2FA();
      } else {
        // cancelling an in-progress setup
        setTwoFAEnabled(false);
        setPhase("idle");
        setFactorId(null);
        setQrCode(null);
        setUri(null);
        setOtpCode("");
      }
      return;
    }

    // toggling on
    // If already enabled, do nothing
    if (twoFAEnabled) return;

    await startEnroll();
  };

  // ===== UI bits you had (recovery codes are still demo) =====

  const handleRefreshCodes = () => {
    message.info("Supabase does not provide recovery codes. Use backup factors or build your own.");
  };

  const handleCopyCodes = async () => {
    try {
      const text = recoveryCodes.map((c) => c.value + (c.used ? " (used)" : "")).join("\n");
      await navigator.clipboard.writeText(text);
      message.success("Copied.");
    } catch {
      message.error("Could not copy. Your browser may block clipboard access.");
    }
  };

  const showSetupPanel = phase === "enrolling" || phase === "verifying";
  const verifyLoading = phase === "verifying";
  const switchLoading = phase === "enrolling" || phase === "disabling" || phase === "verifying";

  return (
    <App>
      <main>
        <PageHeader title="Security Settings" subtitle="Manage your password and secure your account with 2FA." />
        <Divider />

        <Card>
          <Row justify="space-between" align="top" gutter={[16, 16]}>
            <Col flex="auto">
              <Space orientation="vertical" size={4}>
                <Title level={5} style={{ margin: 0 }}>
                  Two-Factor Authentication
                </Title>
                <Text type="secondary">Add an extra layer of security to your account.</Text>
              </Space>
            </Col>

            <Col>
              <Switch
                checked={twoFAEnabled || showSetupPanel}
                onChange={onToggle}
                disabled={switchLoading}
              />
            </Col>
          </Row>

          <Divider style={{ marginTop: 24, marginBottom: 24 }} />

          {twoFAEnabled && phase === "enabled" ? (
            <Text type="secondary">2FA is enabled on your account.</Text>
          ) : (
            <>
              <Row gutter={[24, 24]} align="top">
                {/* QR */}
                <Col xs={24} md={8} lg={7}>
                  <Card size="small" styles={{ body: { padding: 16 } }}>
                    <div
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginInline: "auto",
                      }}
                    >
                      {qrCode ? (
                        <img
                          alt="QR Code for 2FA Setup"
                          src={qrCode}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Text type="secondary" style={{ textAlign: "center" }}>
                          Toggle 2FA on to generate a QR code
                        </Text>
                      )}
                    </div>
                  </Card>
                </Col>

                {/* Instructions + OTP */}
                <Col xs={24} md={16} lg={17}>
                  <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                    <div>
                      <Text strong>1. Scan QR Code</Text>
                      <div>
                        <Text type="secondary">
                          Open your authenticator app (Google Authenticator, Authy, 1Password) and scan the QR code.
                        </Text>
                      </div>
                    </div>

                    <div className="max-w-2xs">
                      <Text strong>2. Enter Verification Code</Text>
                      <Input.OTP onChange={onChange} className="mt-2!" type="input" />
                    </div>

                    <Space size={12} wrap>
                      <Button type="primary" onClick={verifyEnroll} loading={verifyLoading} disabled={!factorId}>
                        Verify &amp; Enable
                      </Button>
                      {uri && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Can&apos;t scan?{" "}
                          <Link
                            onClick={() => {
                              navigator.clipboard
                                .writeText(uri)
                                .then(() => message.success("Setup key copied. Paste it into your authenticator app."))
                                .catch(() => message.error("Could not copy setup key."));
                            }}
                          >
                            Copy setup key
                          </Link>
                        </Text>
                      )}
                    </Space>

                    {uri && (
                      <Typography.Paragraph copyable className="text-xs break-all" style={{ marginBottom: 0 }}>
                        {uri}
                      </Typography.Paragraph>
                    )}
                  </Space>
                </Col>
              </Row>

              {/* Recovery Codes (NOT Supabase-provided) */}
              <Card style={{ marginTop: 24 }} styles={{ body: { padding: 16 } }}>
                <Row align="middle" justify="space-between" gutter={[12, 12]}>
                  <Col flex="auto">
                    <Space orientation="vertical" size={4}>
                      <Space align="center" size={8}>
                        <MdKey />
                        <Text strong>Recovery Codes</Text>
                      </Space>
                      <Text type="secondary">
                        Supabase doesn&apos;t generate recovery codes. This section is demo/UI only unless you implement your own.
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
            </>
          )}
        </Card>
      </main>
    </App>
  );
}