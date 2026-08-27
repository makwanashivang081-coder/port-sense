import type { PortId } from "@port-sense/layer2-canonical";
import type { LaneDefinition } from "../domain/types.js";

/**
 * Fixed V1 lane catalog — domestic IN→IN + export gates.
 * Transit days only when sourced; otherwise null (insufficient).
 */
export const LANE_CATALOG: readonly LaneDefinition[] = [
  // —— Domestic ——
  {
    laneId: "dom:INNSA-INMAA",
    type: "domestic",
    originPortId: "INNSA",
    destinationPortId: "INMAA",
    label: "JNPT → Chennai",
    transitDays: null,
    transitSource: null,
  },
  {
    laneId: "dom:INMUN-INMAA",
    type: "domestic",
    originPortId: "INMUN",
    destinationPortId: "INMAA",
    label: "Mundra → Chennai",
    transitDays: null,
    transitSource: null,
  },
  {
    laneId: "dom:INNSA-INCOK",
    type: "domestic",
    originPortId: "INNSA",
    destinationPortId: "INCOK",
    label: "JNPT → Cochin",
    transitDays: null,
    transitSource: null,
  },
  {
    laneId: "dom:INMUN-INNSA",
    type: "domestic",
    originPortId: "INMUN",
    destinationPortId: "INNSA",
    label: "Mundra → JNPT",
    transitDays: null,
    transitSource: null,
  },
  {
    laneId: "dom:INCOK-INVTZ",
    type: "domestic",
    originPortId: "INCOK",
    destinationPortId: "INVTZ",
    label: "Cochin → Vizag",
    transitDays: null,
    transitSource: null,
  },
  {
    laneId: "dom:INMAA-INCCU",
    type: "domestic",
    originPortId: "INMAA",
    destinationPortId: "INCCU",
    label: "Chennai → Kolkata",
    transitDays: null,
    transitSource: null,
  },
  // —— Export → Jebel Ali ——
  ...gatedExport("AEJEA", "Jebel Ali", [
    "INNSA",
    "INMUN",
    "INMAA",
    "INCOK",
    "INVTZ",
    "INCCU",
  ]),
  // —— Export → Los Angeles (globe pin USLAX / San Pedro; ocean days unknown) ——
  ...gatedExport("USGEN", "Los Angeles", [
    "INNSA",
    "INMUN",
    "INMAA",
    "INCOK",
  ]),
];

function gatedExport(
  code: "AEJEA" | "USGEN",
  destLabel: string,
  origins: PortId[],
): LaneDefinition[] {
  return origins.map((originPortId) => ({
    laneId: `exp:${originPortId}-${code}`,
    type: "export" as const,
    originPortId,
    destinationCode: code,
    label: `${portShort(originPortId)} → ${destLabel}`,
    transitDays: null as number | null,
    transitSource: null as string | null,
  }));
}

function portShort(id: PortId): string {
  const map: Partial<Record<PortId, string>> = {
    INNSA: "JNPT",
    INMUN: "Mundra",
    INMAA: "Chennai",
    INCOK: "Cochin",
    INVTZ: "Vizag",
    INCCU: "Kolkata",
    INDEE: "Deendayal",
  };
  return map[id] ?? id;
}

export function destinationKey(lane: LaneDefinition): string {
  if (lane.type === "domestic") return `port:${lane.destinationPortId}`;
  return `code:${lane.destinationCode}`;
}
