"use client";

import {
  Col,
  Row,
  Tag,
  Card,
  Space,
  Table,
  Button,
  Divider,
  Progress,
  Typography
} from "antd";

import type { ColumnsType } from "antd/es/table";
import {
  MdToll,
  MdAddCard,
  MdTrendingUp,
  MdCreditCard,
  MdReceiptLong,
} from "react-icons/md";

type TopUpOption = {
  key: string;
  title: string;
  tokens: string;
  price: string;
  note: string;
  featured?: boolean;
};

type BillingActivity = {
  key: string;
  date: string;
  type: "Spent" | "Paid";
  details: string;
  amount: string;
};

const topUpOptions: TopUpOption[] = [
  {
    key: "starter",
    title: "Starter Top-Up",
    tokens: "2,500 tokens",
    price: "$12",
    note: "For light usage and quick design reviews.",
  },
  {
    key: "growth",
    title: "Growth Top-Up",
    tokens: "10,000 tokens",
    price: "$39",
    note: "Best value for weekly campaign work.",
    featured: true,
  },
  {
    key: "scale",
    title: "Scale Top-Up",
    tokens: "25,000 tokens",
    price: "$89",
    note: "Built for teams reviewing creatives in volume.",
  },
];

const billingActivity: BillingActivity[] = [
  {
    key: "1",
    date: "Apr 15, 2026",
    type: "Paid",
    details: "Growth top-up package",
    amount: "$39.00",
  },
  {
    key: "2",
    date: "Apr 11, 2026",
    type: "Spent",
    details: "128 banner analysis runs",
    amount: "$12.80",
  },
  {
    key: "3",
    date: "Apr 03, 2026",
    type: "Paid",
    details: "Starter top-up package",
    amount: "$12.00",
  },
];

const activityColumns: ColumnsType<BillingActivity> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Description",
    dataIndex: "details",
    key: "details",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type: BillingActivity["type"]) => (
      <Tag color={type === "Spent" ? "orange" : "green"}>{type}</Tag>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
];

export default function BillingTokensSection() {
  return (
    <Space orientation="vertical" size={24} className="w-full">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={14}>
          <Space orientation="vertical" size={16} className="w-full">
            <Card>
              <Space orientation="vertical" size={8}>
                <div className="flex items-center gap-2 text-slate-500">
                  <MdToll className="text-lg" />
                  <Typography.Text type="secondary">Token Balance</Typography.Text>
                </div>
                <Typography.Title level={3} className="mb-0!">
                  4,280
                </Typography.Title>
                <Typography.Text type="secondary">
                  Enough for roughly 42 standard banner analyses.
                </Typography.Text>
              </Space>
            </Card>

            <Card>
              <Space orientation="vertical" size={8}>
                <div className="flex items-center gap-2 text-slate-500">
                  <MdTrendingUp className="text-lg" />
                  <Typography.Text type="secondary">Monthly Spending</Typography.Text>
                </div>
                <Typography.Title level={3} className="mb-0!">
                  $51.80
                </Typography.Title>
                <Typography.Text type="secondary">
                  68% of your April 2026 working budget is already used.
                </Typography.Text>
                <Progress percent={68} showInfo={false} strokeColor="#1677ff" />
              </Space>
            </Card>
          </Space>
        </Col>

        <Col xs={24} sm={10}>
          <Card
            className="h-full"
            title={
              <div className="flex items-center gap-2">
                <MdCreditCard className="text-lg" />
                <span>Payment Method</span>
              </div>
            }
          >
            <Space orientation="vertical" size={16} className="w-full">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-4">
                <Typography.Text strong>Visa ending in 4242</Typography.Text>
                <div>
                  <Typography.Text type="secondary">Expires 08/2027</Typography.Text>
                </div>
              </div>

              <Button block>Update Card</Button>

              <Divider className="my-0!" />

              <div>
                <Typography.Text strong>Next Recommendation</Typography.Text>
                <div>
                  <Typography.Text type="secondary">
                    Top up before your balance drops below 1,000 tokens to avoid interruptions.
                  </Typography.Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <MdAddCard className="text-lg" />
                <span>Top Up Tokens</span>
              </div>
            }
          >
            <Row gutter={[16, 16]}>
              {topUpOptions.map((option) => (
                <Col xs={24} md={8} key={option.key}>
                  <Card
                    className={option.featured ? "border-primary!" : undefined}
                    styles={{ body: { padding: 20 } }}
                  >
                    <Space orientation="vertical" size={12} className="w-full">
                      <div className="flex items-center justify-between">
                        <Typography.Title level={5} className="mb-0!">
                          {option.title}
                        </Typography.Title>
                        {option.featured ? <Tag color="blue">Popular</Tag> : null}
                      </div>

                      <div>
                        <Typography.Title level={3} className="mb-0!">
                          {option.price}
                        </Typography.Title>
                        <Typography.Text type="secondary">{option.tokens}</Typography.Text>
                      </div>

                      <Typography.Text type="secondary">{option.note}</Typography.Text>

                      <Button type={option.featured ? "primary" : "default"} block>
                        Buy Tokens
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center gap-2">
            <MdReceiptLong className="text-lg" />
            <span>Recent Billing Activity</span>
          </div>
        }
      >
        <Table
          columns={activityColumns}
          dataSource={billingActivity}
          pagination={false}
          rowKey="key"
        />
      </Card>
    </Space>
  );
}
