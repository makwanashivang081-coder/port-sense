import type { ContainerSize } from "@port-sense/layer3-decision";
import type { PortId } from "@port-sense/layer2-canonical";

export type InlandId =
  | "IN_SURAT"
  | "IN_AHMEDABAD"
  | "IN_PUNE"
  | "IN_DELHI"
  | "IN_HYD"
  | "IN_BLR";

export type DistanceBasis = "highway_table" | "haversine_winding";

export interface InlandCity {
  readonly inlandId: InlandId;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
}

export interface InlandCorridor {
  readonly originPortId: PortId;
  readonly km: number;
  readonly highway: string;
  readonly note?: string;
}

export interface InlandRoadLine {
  readonly originPortId: PortId;
  readonly originName: string;
  readonly inlandId: InlandId;
  readonly inlandLabel: string;
  readonly km: number;
  readonly inrPerKm: number;
  readonly roadInr: number;
  readonly tollInr: number;
  readonly truckingInr: number;
  readonly rateClass: "SECONDARY_ESTIMATE";
  readonly highway: string;
  readonly distanceBasis: DistanceBasis;
  readonly formula: string;
}

export interface LandedCostRow {
  readonly originPortId: PortId;
  readonly originName: string;
  readonly inlandLabel: string;
  readonly demurrageInr: number;
  readonly truckingInr: number;
  readonly totalInr: number;
  readonly riskLevel: "low" | "medium" | "high";
  readonly dwellHours: number;
  readonly km: number;
  readonly highWait: boolean;
  readonly road: InlandRoadLine;
  readonly status: "ok" | "insufficient_data";
  readonly insufficientReason?: string;
}

export interface LandedCostResult {
  readonly inlandId: InlandId;
  readonly inlandLabel: string;
  readonly containerSize: ContainerSize;
  readonly containerCount: number;
  readonly ranked: readonly LandedCostRow[];
  readonly winner: LandedCostRow | null;
  readonly saveInrVsRunnerUp: number | null;
  readonly oceanFreight: "insufficient";
  readonly honestyNote: string;
  readonly evaluatedAt: string;
}

export interface LandedCostRequest {
  readonly inlandId: InlandId;
  readonly containerSize: ContainerSize;
  readonly containerCount: number;
  readonly demurrageByOrigin: ReadonlyArray<{
    originPortId: PortId;
    originName: string;
    demurrageInr: number;
    riskLevel: "low" | "medium" | "high";
    dwellHours: number;
    status: "ok" | "insufficient_data";
    insufficientReason?: string;
  }>;
}

export const INLAND_IDS: readonly InlandId[] = [
  "IN_SURAT",
  "IN_AHMEDABAD",
  "IN_PUNE",
  "IN_DELHI",
  "IN_HYD",
  "IN_BLR",
];

export function isInlandId(raw: string): raw is InlandId {
  return (INLAND_IDS as readonly string[]).includes(raw);
}
