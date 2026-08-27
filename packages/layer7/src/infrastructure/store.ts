import type { PortId } from "@port-sense/layer2-canonical";
import type { DailyDwellRow, TemperaturePoint } from "../domain/types.js";
import { readJsonFile } from "../infrastructure/paths.js";

export const TIME_ENGINE_PORTS: readonly PortId[] = [
  "INNSA",
  "INMUN",
  "INMAA",
  "INCOK",
  "INVTZ",
  "INCCU",
  "INDEE",
];

interface DailyFile {
  portId: string;
  source: string;
  yearMeanHours: number;
  days: DailyDwellRow[];
}

interface MonthlyFile {
  months: Array<{
    periodKey: string;
    exportDwellHours: number;
    importDwellHours: number;
    source: string;
  }>;
}

interface TempFile {
  source: string;
  sourceUrl: string;
  ports: Record<string, TemperaturePoint[]>;
}

let dailyCache: DailyFile | null = null;
let monthlyCache: MonthlyFile | null = null;
let tempCache: TempFile | null = null;

export function loadDaily2023(): DailyFile {
  dailyCache ??= readJsonFile<DailyFile>("data/jnpt-daily-2023.json");
  return dailyCache;
}

export function loadMonthlyLdb(): MonthlyFile {
  monthlyCache ??= readJsonFile<MonthlyFile>("data/jnpt-monthly-ldb.json");
  return monthlyCache;
}

export function loadTemperatures(): TempFile {
  tempCache ??= readJsonFile<TempFile>("data/port-temperature-2023-2024.json");
  return tempCache;
}

export function publishedExportHoursFallback(): Readonly<Record<PortId, number>> {
  // Latest published snapshots used only to scale non-JNPT ports on a 2023 shape.
  return {
    INNSA: 78.6,
    INMUN: 105.2,
    INMAA: 84.0,
    INCOK: 52.0,
    INVTZ: 72.0,
    INCCU: 96.0,
    INDEE: 78.6,
  };
}
