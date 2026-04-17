"use client";

import { useEffect, useMemo, useState } from "react";
import { App, Avatar, Button, Card, Col, Form, Input, Row, Select, Skeleton, Typography } from "antd";
import { MdPerson } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type ProfileFormValues = {
  name: string;
  email: string;
  company: string;
  profession: string;
  phone: string;
  bio: string;
};

const professionOptions = [
  { value: "creator", label: "Content Creator" },
  { value: "marketer", label: "Marketer" },
  { value: "designer", label: "Graphic Designer" },
  { value: "agency", label: "Agency Owner" },
  { value: "other", label: "Other" },
];

export default function ProfileSettingsForm() {
  const { message } = App.useApp();
  const supabase = useMemo(() => createClient(), []);
  const [form] = Form.useForm<ProfileFormValues>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (error || !data.user) {
        setUser(null);
        setLoading(false);
        message.error("Could not load your profile settings.");
        return;
      }

      const nextUser = data.user;
      const metadata = nextUser.user_metadata ?? {};

      setUser(nextUser);
      form.setFieldsValue({
        name: metadata.name ?? "",
        email: nextUser.email ?? "",
        company: metadata.company ?? "",
        profession: metadata.profession ?? undefined,
        phone: metadata.phone ?? "",
        bio: metadata.bio ?? "",
      });
      setLoading(false);
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [form, message, supabase]);

  const onFinish = async (values: ProfileFormValues) => {
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user?.user_metadata,
        name: values.name.trim(),
        company: values.company.trim(),
        profession: values.profession,
        phone: values.phone.trim(),
        bio: values.bio.trim(),
      },
    });

    setSaving(false);

    if (error) {
      message.error(error.message || "Could not update your profile.");
      return;
    }

    setUser((current) =>
      current
        ? {
            ...current,
            user_metadata: {
              ...current.user_metadata,
              name: values.name.trim(),
              company: values.company.trim(),
              profession: values.profession,
              phone: values.phone.trim(),
              bio: values.bio.trim(),
            },
          }
        : current
    );
    message.success("Profile settings updated.");
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-4 mb-8">
          <Skeleton.Avatar active size={64} shape="circle" />
          <Skeleton active title={{ width: 180 }} paragraph={{ rows: 1, width: [220] }} />
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar size={64} src={user?.user_metadata?.picture ?? undefined} icon={<MdPerson />} />
          <div>
            <Typography.Title level={4} className="mb-1!">
              {user?.user_metadata?.name || "Your profile"}
            </Typography.Title>
            <Typography.Text type="secondary">
              Update the details shown on your account.
            </Typography.Text>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Typography.Text className="font-semibold">Full Name</Typography.Text>}
              name="name"
              rules={[{ required: true, message: "Please enter your full name." }]}
            >
              <Input size="large" placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={<Typography.Text className="font-semibold">Email</Typography.Text>}
              name="email"
            >
              <Input size="large" disabled />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={<Typography.Text className="font-semibold">Profession</Typography.Text>}
              name="profession"
            >
              <Select
                size="large"
                allowClear
                placeholder="Select your profession"
                options={professionOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={<Typography.Text className="font-semibold">Phone</Typography.Text>}
              name="phone"
            >
              <Input size="large" placeholder="+1 555 123 4567" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label={<Typography.Text className="font-semibold">Bio</Typography.Text>}
              name="bio"
            >
              <Input.TextArea
                rows={3}
                showCount
                maxLength={300}
                placeholder="Tell us a little about your work."
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0!">
          <Button type="primary" htmlType="submit" size="large" loading={saving}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
