"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { AXIS_TICK, CHART_ACCENT, CURSOR_LINE, GRID_STROKE } from "@/components/dashboard/chartTheme";
import { formatTonnesCompact } from "@/lib/data/monthlyCargo";
import { formatINR, formatINRCompact } from "@/lib/utils";
import type { CargoMonthPoint, PortCargoTotal, SavingsRow } from "@/lib/data/year2526";

const PORT_COLORS: Record<string, string> = {
  jnpt: "var(--brand-orange)",
  vizag: "#f5c16c",
  chennai: "#7dd3fc",
  kolkata: "#c4b5fd",
  cochin: "#86efac",
};

interface Year2526ChartsProps {
  series: readonly CargoMonthPoint[];
  portTotals: readonly PortCargoTotal[];
  savings: readonly SavingsRow[];
}

export function Year2526Charts({ series, portTotals, savings }: Year2526ChartsProps) {
  const transit = series.map((row) => ({ label: row.label, Transit: row.total }));
  const saveData = savings
    .filter((row) => row.savedInr > 0)
    .map((row) => ({ label: row.label, Saved: row.savedInr }));

  return (
    <div className="grid min-w-0 gap-4">
      <article className="min-w-0 rounded-card border border-hairline bg-surface-2 p-3 sm:p-5">
        <p className="text-label font-semibold uppercase tracking-[0.12em] text-ink-4">Total transit</p>
        <h3 className="mt-1 text-title-3 font-semibold text-ink">Cargo handled each month</h3>
        <div className="mt-3 h-48 w-full min-w-0 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transit} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID_STROKE} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} interval="preserveStartEnd" />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                width={44}
                tickFormatter={(value: number) => formatTonnesCompact(value).replace(" t", "")}
              />
              <Tooltip content={<ChartTooltip formatValue={formatTonnesCompact} />} />
              <Line type="monotone" dataKey="Transit" stroke={CHART_ACCENT} strokeWidth={2.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="min-w-0 rounded-card border border-hairline bg-surface-2 p-3 sm:p-5">
        <p className="text-label font-semibold uppercase tracking-[0.12em] text-ink-4">Money they could have saved</p>
        <h3 className="mt-1 text-title-3 font-semibold text-ink">Vs the cheapest Indian gate</h3>
        <div className="mt-3 h-48 w-full min-w-0 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={saveData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={GRID_STROKE} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                width={48}
                tickFormatter={(value: number) =>
                  value >= 100000 ? formatINRCompact(value) : `₹${Math.round(value / 1000)}k`
                }
              />
              <Tooltip cursor={CURSOR_LINE} content={<ChartTooltip formatValue={formatINR} />} />
              <Bar dataKey="Saved" fill={CHART_ACCENT} radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="min-w-0 rounded-card border border-hairline bg-surface-2 p-3 sm:p-5">
        <p className="text-label font-semibold uppercase tracking-[0.12em] text-ink-4">Transit by gate</p>
        <h3 className="mt-1 text-title-3 font-semibold text-ink">Share of the 10-month total</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {portTotals.map((row) => {
            const max = portTotals[0]?.tonnes || 1;
            const width = Math.max(8, (row.tonnes / max) * 100);
            return (
              <li key={row.portId} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-3">
                <span className="truncate text-small text-ink-2">{row.label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${width}%`, background: PORT_COLORS[row.portId] ?? CHART_ACCENT }}
                  />
                </div>
                <span className="text-small font-semibold tabular-nums text-ink">
                  {formatTonnesCompact(row.tonnes)}
                </span>
              </li>
            );
          })}
        </ul>
      </article>
    </div>
  );
}
