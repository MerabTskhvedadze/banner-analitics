"use client";

import { useEffect, useState } from 'react';
import { Flex, Tag } from 'antd';

import {
  MdScore,
  MdWallet,
  MdInsights,
  MdFilterHdr,
  MdTrendingUp,
} from 'react-icons/md';

import StatsCard from './StatsCard';

export function StatsList() {
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      title: "Available Tokens",
      icon: <MdWallet className="text-lg text-primary" />,
      value: "2,405",
      info: "Credits"
    },
    {
      title: "Banners Analyzed",
      icon: <MdFilterHdr className="text-lg text-primary" />,
      value: "142",
      info: (
        <Tag color="green">
          <Flex align="center" gap={2}>
            <MdTrendingUp /> 12 this week
          </Flex>
        </Tag>
      ),
    },
    {
      title: "Avg. AI Score",
      icon: <MdScore className="text-lg text-primary" />,
      value: "8",
      info: "/ 10"
    },
  ];

  // imitate loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatsCard key={idx}
          stat={{ ...stat }}
          loading={loading}
        />
      ))}
    </div>
  )
}