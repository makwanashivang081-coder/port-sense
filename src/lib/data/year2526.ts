import { MONTHLY_CARGO, MONTHLY_CARGO_PERIODS, monthlyCargoForPeriod } from "@/lib/data/monthlyCargo";
import { portShortLabel } from "@/lib/data/portLabels";
import { SAMPLE_INPUT } from "@/lib/data/sample";
import { compareAllPorts } from "@/lib/demurrageCalc";
import { quoteCityToPort } from "@/lib/land/cargoCost.service";
import { DEFAULT_START_LOCATION_ID, getStartLocation } from "@/lib/data/startLocations";
import { PORTS } from "@/lib/data/ports";

export const YEAR_2526_PORTS = ["jnpt", "chennai", "cochin", "vizag", "kolkata"] as const;
export type Year2526PortId = (typeof YEAR_2526_PORTS)[number];

const MONTH_SHORT: Record<string, string> = {
  "2025-10": "Oct 25",
  "2025-11": "Nov 25",
  "2025-12": "Dec 25",
  "2026-01": "Jan 26",
  "2026-02": "Feb 26",
  "2026-03": "Mar 26",
  "2026-04": "Apr 26",
  "2026-05": "May 26",
  "2026-06": "Jun 26",
  "2026-07": "Jul 26",
};

export interface CargoMonthPoint {
  readonly periodKey: string;
  readonly label: string;
  readonly total: number;
  readonly byPort: Record<Year2526PortId, number>;
}

export interface PortCargoTotal {
  readonly portId: Year2526PortId;
  readonly label: string;
  readonly tonnes: number;
}

export interface ExtraWaitRow {
  readonly portId: string;
  readonly label: string;
  readonly extraDwellDays: number;
  readonly extraCostInr: number;
}

export interface InlandHaulRow {
  readonly portId: string;
  readonly label: string;
  readonly km: number;
  readonly roadPredictedInr: number;
  readonly railPredictedInr: number;
  readonly cheapestInr: number;
}

export function cargoMonthSeries(): CargoMonthPoint[] {
  return MONTHLY_CARGO_PERIODS.map((periodKey) => {
    const rows = monthlyCargoForPeriod(periodKey);
    const byPort = {
      jnpt: 0,
      chennai: 0,
      cochin: 0,
      vizag: 0,
      kolkata: 0,
    } as Record<Year2526PortId, number>;
    for (const row of rows) {
      if (row.portUiId in byPort) {
        byPort[row.portUiId as Year2526PortId] = row.tonnes;
      }
    }
    return {
      periodKey,
      label: MONTH_SHORT[periodKey] ?? periodKey,
      total: rows.reduce((sum, row) => sum + row.tonnes, 0),
      byPort,
    };
  });
}

export function cargoPortTotals(): PortCargoTotal[] {
  const sums: Record<Year2526PortId, number> = {
    jnpt: 0,
    chennai: 0,
    cochin: 0,
    vizag: 0,
    kolkata: 0,
  };
  for (const point of cargoMonthSeries()) {
    for (const portId of YEAR_2526_PORTS) {
      sums[portId] += point.byPort[portId];
    }
  }
  return YEAR_2526_PORTS.map((portId) => ({
    portId,
    label: portShortLabel(portId),
    tonnes: sums[portId],
  })).sort((a, b) => b.tonnes - a.tonnes);
}

export function extraWaitForTypicalBooking(): ExtraWaitRow[] {
  return compareAllPorts({
    shipDate: SAMPLE_INPUT.shipDate,
    containerType: SAMPLE_INPUT.containerType,
    carrierId: SAMPLE_INPUT.carrierId,
    containerCount: SAMPLE_INPUT.containerCount,
  }).map(({ port, result }) => ({
    portId: port.id,
    label: portShortLabel(port.id, port.name),
    extraDwellDays: port.extraDwellDays,
    extraCostInr: result?.estimatedCostINR ?? 0,
  }));
}

export function inlandFromDefaultCity(): InlandHaulRow[] {
  const city = getStartLocation(DEFAULT_START_LOCATION_ID);
  return PORTS.map((port) => {
    const haul = quoteCityToPort({
      startCityId: city.id,
      toPortId: port.id,
      containerType: SAMPLE_INPUT.containerType,
      containerCount: SAMPLE_INPUT.containerCount,
    });
    const road = haul?.quotes.find((row) => row.mode === "road");
    const rail = haul?.quotes.find((row) => row.mode === "rail_bulk");
    const cheapest = Math.min(road?.predictedCostInr ?? Infinity, rail?.predictedCostInr ?? Infinity);
    return {
      portId: port.id,
      label: portShortLabel(port.id, port.name),
      km: haul?.km ?? 0,
      roadPredictedInr: road?.predictedCostInr ?? 0,
      railPredictedInr: rail?.predictedCostInr ?? 0,
      cheapestInr: Number.isFinite(cheapest) ? cheapest : 0,
    };
  });
}

export const YEAR_2526_SOURCE = {
  file: MONTHLY_CARGO.source.file,
  jnpaLdb: MONTHLY_CARGO.source.officialDayWiseWaitFee.jnpaNlds,
  grain: "Monthly cargo tonnes · Oct 2025–Jul 2026 · five major ports",
} as const;

export function savingsVsCheapest(extraWait: readonly ExtraWaitRow[]): SavingsRow[] {
  if (extraWait.length === 0) return [];
  const floor = Math.min(...extraWait.map((row) => row.extraCostInr));
  return extraWait
    .map((row) => ({
      portId: row.portId,
      label: row.label,
      extraCostInr: row.extraCostInr,
      extraDwellDays: row.extraDwellDays,
      savedInr: Math.max(0, row.extraCostInr - floor),
    }))
    .sort((a, b) => b.savedInr - a.savedInr);
}

export interface SavingsRow {
  readonly portId: string;
  readonly label: string;
  readonly extraCostInr: number;
  readonly extraDwellDays: number;
  readonly savedInr: number;
}

export function transitStats(series: readonly CargoMonthPoint[], extraWait: readonly ExtraWaitRow[]) {
  const totalTransit = series.reduce((sum, row) => sum + row.total, 0);
  const months = Math.max(1, series.length);
  const avgMonthlyTransit = totalTransit / months;
  const avgExtraDays =
    extraWait.reduce((sum, row) => sum + row.extraDwellDays, 0) / Math.max(1, extraWait.length);
  const savings = savingsVsCheapest(extraWait);
  const avgSaved =
    savings.reduce((sum, row) => sum + row.savedInr, 0) / Math.max(1, savings.length);
  const maxSaved = savings[0]?.savedInr ?? 0;
  return { totalTransit, months, avgMonthlyTransit, avgExtraDays, avgSaved, maxSaved, savings };
}
