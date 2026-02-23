"use client";

import { useMemo } from "react";

export type TokenUsageData = {
  used: number;          
  remaining: number;     
  usedLabel?: string;    
  remainingLabel?: string;
};

type PieChartProps = {
  data?: TokenUsageData | null; 
  onViewHistory?: () => void;   
  title?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function PieChart({
  data,
  onViewHistory,
  title = "Token Usage",
}: PieChartProps) {
  const used = data?.used ?? 0;
  const remaining = data?.remaining ?? 0;

  const { total, percentUsed } = useMemo(() => {
    const t = used + remaining;
    const p = t > 0 ? (used / t) * 100 : 0;
    return {
      total: t,
      percentUsed: clamp(p, 0, 100),
    };
  }, [used, remaining]);

  const circumference = 440;
  const dashOffset = useMemo(() => {
    return circumference * (1 - percentUsed / 100);
  }, [percentUsed]);

  const usedLabel = data?.usedLabel ?? "Analysis Scans";
  const remainingLabel = data?.remainingLabel ?? "Remaining";

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm flex flex-col">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h2>

      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            className="text-slate-100 dark:text-surface-darker"
            cx="100"
            cy="100"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
          />
          <circle
            className="text-primary transition-all duration-1000 ease-out"
            cx="100"
            cy="100"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(percentUsed)}%
          </span>
          <span className="text-xs text-slate-400">Used</span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-slate-600 dark:text-slate-400">{usedLabel}</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {used.toLocaleString()} TKN
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-400">{remainingLabel}</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {remaining.toLocaleString()} TKN
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
          <span>Total</span>
          <span className="font-medium">{total.toLocaleString()} TKN</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewHistory}
        className="w-full mt-6 py-2 border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary transition-colors"
      >
        View Transaction History
      </button>
    </div>
  );
}