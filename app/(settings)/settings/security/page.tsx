"use client";

import { useMemo } from "react";
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
  Skeleton,
} from "antd";
import { MdKey, MdRefresh, MdContentCopy } from "react-icons/md";
import type { GetProps } from "antd";
import { Input } from "antd";
import { createClient } from "@/lib/supabase/client";
import TwoFA from "@/components/settings/security/TwoFA";

const { Text } = Typography;

export default function Page() {
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

  return (
    <App>
      <main>
        <PageHeader title="Security Settings" subtitle="Manage your password and secure your account with 2FA." />
        <Divider />

        <TwoFA />

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
                <Typography.Text
                  keyboard
                  title={c.used ? "Used" : undefined}
                  style={{
                    textDecoration: c.used ? "line-through" : "none",
                    userSelect: c.used ? "none" : "text",
                  }}
                >
                  {c.value}
                </Typography.Text>
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
      </main>
    </App>
  );
}
