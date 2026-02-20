import React from 'react'
import {
  Card,
  Flex,
  Skeleton,
  Typography
} from 'antd'

interface Stat {
  title: string;
  value: string;
  info: React.ReactNode;
  icon: React.ReactNode;
}

interface Props {
  stat: Stat;
  loading: boolean;
}

export default function StatsCard({ stat, loading }: Props) {
  if (loading) {
    return (
      <Card className="rounded-2xl!">
        <Card.Meta
          description={
            <Flex align="start" justify="space-between">
              <Flex vertical gap={7} >
                <Skeleton.Input active size="small" />
                <Flex align="end" gap={8}>
                  <Skeleton.Input active size="default" />
                </Flex>
              </Flex>
              <Skeleton.Avatar active shape="square" size="large" />
            </Flex>
          }
        />
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl! shadow">
      <Card.Meta
        description={
          <Flex align="start" justify="space-between">
            <Flex vertical gap={5}>
              <Typography.Text>{stat.title}</Typography.Text>
              <Flex gap={7} align="end">
                <Typography.Title className="mb-0!" level={3}>
                  {stat.value}
                </Typography.Title>
                <span>{stat.info}</span>
              </Flex>
            </Flex>
            <div className="p-2 rounded-md bg-[#E7F2FD]">
              {stat.icon}
            </div>
          </Flex>
        }
      />
    </Card>
  )
}
