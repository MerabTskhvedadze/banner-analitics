import React, { useMemo, useState } from "react";

export type RangeKey = "7d" | "30d" | "1y";

export type ActivityEvent = {
  date: string; // ISO or Date-parseable (e.g. "2026-02-19" or ISO timestamp)
  count: number;
};

type CandlePoint = {
  label: string;
  raw: number;   // actual aggregated count for that slot
  value: number; // normalized 0..100 for height
  isEmpty: boolean;
};

type Props = {
  events?: ActivityEvent[] | null;
  title?: string;
  className?: string;
  defaultRange?: RangeKey;
  onRangeChange?: (range: RangeKey) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isValidDate(d: Date) {
  return !Number.isNaN(d.getTime());
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function keyDay(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekdayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function monthLabel(year: number, monthIndex0: number) {
  const d = new Date(year, monthIndex0, 1);
  return d.toLocaleDateString(undefined, { month: "short" });
}

/**
 * Builds the window slots (labels + keys) for the selected range.
 * - 7d: last 7 days including today
 * - 30d: last 30 days including today
 * - 1y: months of current year (Jan..Dec)
 */
function buildWindow(range: RangeKey) {
  const today = startOfDay(new Date());

  if (range === "7d") {
    const slots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      slots.push({
        slotKey: keyDay(d),
        label: weekdayLabel(d),
      });
    }
    return { type: "day" as const, slots };
  }

  if (range === "30d") {
    const slots = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // label as day-of-month (compact)
      slots.push({
        slotKey: keyDay(d),
        label: String(d.getDate()),
      });
    }
    return { type: "day" as const, slots };
  }

  // 1y: calendar year months
  const year = today.getFullYear();
  const slots = Array.from({ length: 12 }, (_, m) => ({
    slotKey: `${year}-${String(m + 1).padStart(2, "0")}`, // YYYY-MM
    label: monthLabel(year, m),
  }));
  return { type: "month" as const, slots, year };
}

function toMonthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function CandleChart({
  events,
  title = "Analysis Activity",
  className = "",
  defaultRange = "7d",
  onRangeChange,
}: Props) {
  const [range, setRange] = useState<RangeKey>(defaultRange);

  const windowDef = useMemo(() => buildWindow(range), [range]);

  const points: CandlePoint[] = useMemo(() => {
    // aggregate incoming events into a map keyed by day or month
    const map = new Map<string, number>();

    if (events && events.length) {
      for (const e of events) {
        const d = startOfDay(new Date(e.date));
        if (!isValidDate(d) || !Number.isFinite(e.count)) continue;

        const k = windowDef.type === "month" ? toMonthKey(d) : keyDay(d);
        map.set(k, (map.get(k) ?? 0) + e.count);
      }
    }

    // fill window slots (missing -> 0)
    const raws = windowDef.slots.map((s) => map.get(s.slotKey) ?? 0);
    const maxRaw = Math.max(1, ...raws);

    return windowDef.slots.map((s, idx) => {
      const raw = raws[idx];
      const isEmpty = raw === 0;

      // empty candle: render a small muted bar so it's visible
      const value = isEmpty ? 8 : clamp(Math.round((raw / maxRaw) * 100), 8, 100);

      return {
        label: s.label,
        raw,
        value,
        isEmpty,
      };
    });
  }, [events, windowDef]);

  const maxValue = useMemo(() => (points.length ? Math.max(...points.map((p) => p.value)) : 0), [points]);
  const maxIndex = useMemo(() => points.findIndex((p) => p.value === maxValue && !p.isEmpty), [points, maxValue]);

  const handleRangeChange = (next: RangeKey) => {
    setRange(next);
    onRangeChange?.(next);
  };

  return (
    <div
      className={[
        " bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>

        <select
          value={range}
          onChange={(e) => handleRangeChange(e.target.value as RangeKey)}
          className="bg-slate-100 dark:bg-surface-darker text-sm border-none rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">This Year</option>
        </select>
      </div>

      {/* Chart */}
      <div
        className={[
          "relative h-64 w-full flex items-end justify-between px-2",
          range === "30d" ? "gap-1" : "gap-2 md:gap-4",
        ].join(" ")}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full h-px bg-slate-100 dark:bg-border-dark border-dashed" />
          <div className="w-full h-px bg-slate-100 dark:bg-border-dark border-dashed" />
          <div className="w-full h-px bg-slate-100 dark:bg-border-dark border-dashed" />
          <div className="w-full h-px bg-slate-100 dark:bg-border-dark border-dashed" />
          <div className="w-full h-px bg-slate-100 dark:bg-border-dark border-dashed" />
        </div>

        {points.map((pt, i) => {
          const isPeak = i === maxIndex;

          return (
            <div
              key={`${pt.label}-${i}`}
              className={[
                "relative z-10 w-full rounded-t-lg transition-all group",
                pt.isEmpty
                  ? "bg-slate-200/60 dark:bg-slate-700/40"
                  : isPeak
                    ? "bg-linear-to-t from-primary to-blue-400 shadow-[0_0_20px_rgba(19,73,236,0.3)]"
                    : "bg-primary/20 hover:bg-primary/30",
              ].join(" ")}
              style={{ height: `${pt.value}%` }}
            >
              {/* tooltip */}
              <div
                className={[
                  "opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs px-2 py-1 rounded whitespace-nowrap",
                  pt.isEmpty ? "bg-slate-700" : isPeak ? "bg-primary" : "bg-slate-700",
                ].join(" ")}
              >
                {pt.raw}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div
        className={[
          "flex justify-between mt-4 px-2 text-xs text-slate-400 dark:text-slate-500 font-medium",
          range === "30d" ? "gap-1" : "",
        ].join(" ")}
      >
        {points.map((pt, i) => {
          const isPeak = i === maxIndex;
          return (
            <span key={`${pt.label}-x-${i}`} className={isPeak ? "text-primary font-bold" : ""}>
              {pt.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}