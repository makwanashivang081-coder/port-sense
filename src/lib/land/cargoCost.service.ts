import type { ContainerType } from "@/types";
import { haversineKm } from "@/lib/geo/haversine";
import { getPtpkRate, PTPK_SOURCE, type PtpkMode } from "@/lib/land/ptpkRates";
import { getStartLocation } from "@/lib/data/startLocations";
import { PORTS } from "@/lib/data/ports";

/**
 * Indicative payload tonnes per box for PTPK (not tare, not the BL).
 * 20ft ~10 t, 40ft ~20 t, 40hc ~22 t.
 */
export const INDICATIVE_PAYLOAD_TONNES: Record<ContainerType, number> = {
  "20ft": 10,
  "40ft": 20,
  "40hc": 22,
};

export const CARGO_COST_HONESTY = PTPK_SOURCE;

export interface CargoModeQuote {
  readonly mode: PtpkMode;
  readonly label: string;
  readonly km: number;
  readonly ratePtpk: number;
  readonly tonnes: number;
  readonly costInr: number;
}

export interface CargoHaulResult {
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly km: number;
  readonly tonnes: number;
  readonly quotes: readonly CargoModeQuote[];
  readonly honestyNote: string;
}

export function payloadTonnes(containerType: ContainerType, containerCount: number): number {
  return INDICATIVE_PAYLOAD_TONNES[containerType] * Math.max(1, containerCount);
}

export function quotePtpkHaul(
  from: { lat: number; lng: number; label: string },
  to: { lat: number; lng: number; label: string },
  tonnes: number,
): CargoHaulResult {
  const km = Math.round(haversineKm(from, to) * 100) / 100;
  const weight = Math.max(0.01, tonnes);
  const modes: Array<{ mode: PtpkMode; label: string }> = [
    { mode: "road", label: "Road" },
    { mode: "rail_bulk", label: "Rail bulk" },
    { mode: "rail_parcel", label: "Rail parcel" },
  ];
  const quotes = modes.map(({ mode, label }) => {
    const ratePtpk = getPtpkRate(km, mode);
    return {
      mode,
      label,
      km,
      ratePtpk,
      tonnes: weight,
      costInr: Math.round(km * ratePtpk * weight),
    };
  });
  return {
    fromLabel: from.label,
    toLabel: to.label,
    km,
    tonnes: weight,
    quotes,
    honestyNote: CARGO_COST_HONESTY,
  };
}

export function quoteCityToPort(options: {
  startCityId: string;
  toPortId: string;
  containerType: ContainerType;
  containerCount: number;
}): CargoHaulResult | null {
  const city = getStartLocation(options.startCityId);
  const port = PORTS.find((row) => row.id === options.toPortId);
  if (!port) return null;
  return quotePtpkHaul(
    { lat: city.lat, lng: city.lng, label: city.label },
    { lat: port.lat, lng: port.lng, label: port.name },
    payloadTonnes(options.containerType, options.containerCount),
  );
}
