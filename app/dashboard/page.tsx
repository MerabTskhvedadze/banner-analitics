"use client";

import { StatsList } from "@/components/dashboard";
import { CandleChart, PieChart } from "@/components/ui";
import { Button, Typography } from "antd";
import {
  MdTopic,
  MdChevronLeft,
  MdChevronRight,
  MdAddPhotoAlternate,
} from "react-icons/md";

import { DataTable, type Column } from '@/components/ui/Table';

type RecentRow = {
  id: string;
  thumbnailSrc: string;
  filename: string;
  dimensions: string;
  platformIcon?: React.ReactNode;
  platformName: string;
  date: string;
  score: string;
};

export default function Page() {
  const recentData: RecentRow[] = [
    {
      id: "1",
      thumbnailSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWwRaQx385XXB5MKUi7bpGUPxLdjeLp33T0DdtDJ_hSMdfxInHGpJK1rR4EKAEokLJqvQXw_1cLaCRXYn2MWXy6V2yAALV5BO_JUtnHwY_WCHwmmRYMcgB_d-pivyJc5eS6xl9RgbSNJ_pVTQOwjtdINz-vwZT7MNEvp2b4JjELxUPJ0blG6t1S7fSl59dn8S7K4nvXO7BAPa0jcRyy3oSqLzZ0GbIm4-2-UtZ8XeX9XUYn4ShTN7yxqYiQySg21BRB-h0UAvOpJW3",
      filename: "Summer_Sale_IG_Story.png",
      dimensions: "1080x1920px",
      platformName: "Instagram",
      date: "Oct 24, 2023",
      score: "9.2 / 10",
    },
  ];

  const recentColumns: Column<RecentRow>[] = [
    {
      key: "preview",
      header: "Preview",
      headerClassName: "w-16",
      render: (row) => (
        <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
          <img alt={`${row.filename} thumbnail`} className="h-full w-full object-cover" src={row.thumbnailSrc} />
        </div>
      ),
    },
    {
      key: "filename",
      header: "Filename",
      render: (row) => (
        <>
          <div className="text-sm font-medium text-slate-900 dark:text-white">{row.filename}</div>
          <div className="text-xs text-slate-400">{row.dimensions}</div>
        </>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.platformIcon}
          <span className="text-sm text-slate-600 dark:text-slate-300">{row.platformName}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date Analyzed",
      cellClassName: "px-6 py-4 text-sm text-slate-500",
      render: (row) => row.date,
    },
    {
      key: "score",
      header: "AI Score",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          {row.score}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "text-right",
      cellClassName: "px-6 py-4 text-right",
      render: () => (
        // <button className="text-primary hover:text-primary-hover font-medium text-sm">Report</button>
        <Button size="small" type="link" href="#">Report</Button>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography.Title level={2} className="mb-0!">Dashboard Overview</Typography.Title>
          <Typography.Text className="mb-0!" type="secondary">
            Review your AI analysis performance and token usage.
          </Typography.Text>
        </div>

        <Button
          size="large"
          icon={<MdAddPhotoAlternate className="text-lg" />}
          type="primary"
          onClick={() => console.log("new analysis")}
        >
          New Analysis
        </Button>
      </div>

      <StatsList />

      {/* //* **** charts ****  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-1 lg:col-span-2">
          <CandleChart
            events={[
              { date: "2026-02-13", count: 12 },
              { date: "2026-02-14", count: 18 },
              { date: "2026-02-15", count: 9 },
              { date: "2026-02-16", count: 21 },
              { date: "2026-02-17", count: 5 },
              { date: "2026-02-18", count: 0 },
              { date: "2026-02-19", count: 27 },
              { date: "2026-01-19", count: 27 },
            ]}
            onRangeChange={(range) => console.log("range changed:", range)}
          />
        </div>

        <div className="md:col-span-1 lg:col-span-1">
          <PieChart
            data={{
              used: 850,
              remaining: 450,
              usedLabel: "Analysis Scans",
              remainingLabel: "Remaining",
            }}
            onViewHistory={() => console.log("open history modal")}
          />
        </div>
      </div>

      {/* //* **** history table ****  */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Typography.Title level={4} className="mb-0!">Recent Analysis</Typography.Title>
          <Typography.Link href="/dashboard/history" className="mb-0!">
            View all history →
          </Typography.Link>
        </div>

        <DataTable<RecentRow>
          columns={recentColumns}
          data={recentData}
          rowKey={(row) => row.id}
          emptyState={
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-50 rounded-full p-4 mb-4">
                <MdTopic className="text-4xl text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-medium">No banners analyzed yet</h3>
              <p className="text-slate-500 text-sm mt-1">Upload your first banner to see results here.</p>
            </div>
          }
          footer={
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing 3 of 142 items</span>
              <div className="flex gap-1">
                <button className="p-1 text-slate-400 hover:text-primary disabled:opacity-50">
                  <MdChevronLeft className="text-sm" />
                </button>
                <button className="p-1 text-slate-400 hover:text-primary">
                  <MdChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          }
        />
      </div>
    </main>
  );
}