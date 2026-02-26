"use client";

import { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Space, Button, Switch, Divider, message, Typography, App, Skeleton } from "antd";
import type { GetProps } from "antd";
import { Input } from "antd";
import { createClient } from "@/lib/supabase/client";

type OTPProps = GetProps<typeof Input.OTP>;
const { Title, Text, Link } = Typography;

type Phase = "idle" | "enrolling" | "verifying" | "enabled" | "disabling";

export default function TwoFA() {
  const supabase = useMemo(() => createClient(), []);

  const [statusLoading, setStatusLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("idle");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  const onChange: OTPProps["onChange"] = (text) => setOtpCode(text);

  // --- Helpers ---

  const clearLocalSetupState = () => {
    setOtpCode("");
    setQrCode(null);
    setUri(null);
    setFactorId(null);
  };

  const removeAllUnverifiedTotpFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;

    const totpList: any[] = (data as any)?.totp ?? [];
    const unverified = totpList.filter((f: any) => f?.status !== "verified");

    for (const f of unverified) {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: f.id });
      if (unenrollError) throw unenrollError;
    }
  };

  // --- Load status on mount ---
  useEffect(() => {
    const load = async () => {
      setStatusLoading(true);
      try {
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          message.error("Please sign in to manage security settings.");
          setTwoFAEnabled(false);
          setPhase("idle");
          clearLocalSetupState();
          return;
        }

        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) {
          message.error("Could not load 2FA status.");
          return;
        }

        const totpList: any[] = (data as any)?.totp ?? [];
        const verified = totpList.find((f: any) => f.status === "verified");
        const hasUnverified = totpList.some((f: any) => f.status !== "verified");

        if (verified?.id) {
          setTwoFAEnabled(true);
          setFactorId(verified.id);
          setPhase("enabled");
          setQrCode(null);
          setUri(null);
          setOtpCode("");
          return;
        }

        // IMPORTANT: after reload we can't re-fetch QR/URI for an existing unverified factor,
        // so we do NOT enter "enrolling" automatically. We ask user to restart.
        if (hasUnverified) {
          setTwoFAEnabled(false);
          setPhase("idle");
          clearLocalSetupState();
          message.info("2FA setup was started but not completed. Toggle 2FA on again to restart and get a new QR code.");
          return;
        }

        setTwoFAEnabled(false);
        setPhase("idle");
        clearLocalSetupState();
      } finally {
        setStatusLoading(false);
      }
    };

    load();
  }, [supabase]);

  // --- Actions ---

  const startEnroll = async () => {
    setPhase("enrolling");
    setOtpCode("");
    setQrCode(null);
    setUri(null);

    try {
      // Fix for: factor with friendly name already exists
      await removeAllUnverifiedTotpFactors();
    } catch (e: any) {
      console.error("Failed to remove unverified TOTP factors:", e);
      message.error(e?.message || "Could not clear previous 2FA attempt.");
      setPhase("idle");
      return;
    }

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
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });

    if (error) {
      setPhase("enrolling");
      message.error(error.message || "Invalid code. Please try again.");
      return;
    }

    setTwoFAEnabled(true);
    setPhase("enabled");
    setQrCode(null);
    setUri(null);
    setOtpCode("");
    message.success("2FA enabled.");
  };

  const disable2FA = async () => {
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
    if (!checked) {
      if (twoFAEnabled) {
        await disable2FA();
      } else {
        // cancel setup UI only (also clears local QR/URI)
        setPhase("idle");
        clearLocalSetupState();
      }
      return;
    }

    if (twoFAEnabled) return;
    await startEnroll();
  };

  // --- UI flags ---
  const showSetupPanel = !statusLoading && (phase === "enrolling" || phase === "verifying");
  const verifyLoading = phase === "verifying";
  const switchLoading = phase === "enrolling" || phase === "disabling" || phase === "verifying";

  return (
    <App>
      <Card>
        <Row justify="space-between" align="top" gutter={[16, 16]}>
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Title level={5} style={{ margin: 0 }}>
                Two-Factor Authentication
              </Title>

              {twoFAEnabled && phase === "enabled" ? (
                <Text type="secondary">Two-Factor Authentication is enabled for your account</Text>
              ) : (
                <Text type="secondary">Add an extra layer of security to your account.</Text>
              )}
            </Space>
          </Col>

          <Col>
            <Switch
              checked={!statusLoading && (twoFAEnabled || showSetupPanel)}
              onChange={onToggle}
              disabled={statusLoading || switchLoading}
            />
          </Col>
        </Row>

        {statusLoading ? (
          <>
            <Divider style={{ marginTop: 24, marginBottom: 24 }} />
            <Row gutter={[24, 24]} align="top">
              <Col xs={24} md={8} lg={7}>
                <Card size="small" styles={{ body: { padding: 16 } }}>
                  <Skeleton.Image style={{ width: 160, height: 160, marginInline: "auto" }} active />
                </Card>
              </Col>
              <Col xs={24} md={16} lg={17}>
                <Skeleton active paragraph={{ rows: 5 }} />
              </Col>
            </Row>
          </>
        ) : (
          !twoFAEnabled &&
          phase !== "enabled" && (
            <>
              <Divider style={{ marginTop: 24, marginBottom: 24 }} />
              <Row gutter={[24, 24]} align="top">
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
            </>
          )
        )}
      </Card>
    </App>
  );
}