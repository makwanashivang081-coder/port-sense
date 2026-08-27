import "server-only";

import {
  createTimeRuntime,
  analog2023Date,
  type TimeRuntime,
} from "@port-sense/layer7-time";
import type { PortId } from "@port-sense/layer2-canonical";

let timeRuntime: TimeRuntime | null = null;

export function getTimeRuntime(): TimeRuntime {
  timeRuntime ??= createTimeRuntime();
  return timeRuntime;
}

export function defaultCalendarDate(now: Date = new Date()): string {
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return analog2023Date(`2023-${mm}-${dd}`);
}

export function parseAsOfDate(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  if (raw < "2023-01-01" || raw > "2024-12-31") return undefined;
  return raw;
}

export function dwellHoursByPort(asOfDate: string): Partial<Record<PortId, number>> {
  return getTimeRuntime().clock.dwellByPort(asOfDate);
}
