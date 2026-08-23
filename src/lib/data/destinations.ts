import type { SelectOption } from "@/components/ui/Field";

export type LaneMode = "domestic" | "export";

export interface DestinationOption {
  readonly id: string;
  readonly mode: LaneMode;
  /** Value sent to /api/lanes as `destination` */
  readonly apiValue: string;
  readonly label: string;
  readonly hint: string;
}

/** Destinations that exist in Layer-4 catalog (UI labels only). */
export const DESTINATIONS: readonly DestinationOption[] = [
  {
    id: "chennai",
    mode: "domestic",
    apiValue: "chennai",
    label: "Chennai (INMAA)",
    hint: "Compare Indian origins into Chennai",
  },
  {
    id: "cochin",
    mode: "domestic",
    apiValue: "cochin",
    label: "Cochin (INCOK)",
    hint: "Compare origins into Cochin",
  },
  {
    id: "jnpt",
    mode: "domestic",
    apiValue: "jnpt",
    label: "JNPT (INNSA)",
    hint: "e.g. Mundra → JNPT coastal",
  },
  {
    id: "vizag",
    mode: "domestic",
    apiValue: "vizag",
    label: "Vizag (INVTZ)",
    hint: "Compare origins into Vizag",
  },
  {
    id: "kolkata",
    mode: "domestic",
    apiValue: "kolkata",
    label: "Kolkata (INCCU)",
    hint: "Compare origins into Kolkata",
  },
  {
    id: "AEJEA",
    mode: "export",
    apiValue: "AEJEA",
    label: "Jebel Ali (UAE)",
    hint: "Indian gates → Jebel Ali",
  },
  {
    id: "USGEN",
    mode: "export",
    apiValue: "USGEN",
    label: "USA (stub)",
    hint: "Same Indian-origin demurrage as UAE — ocean days unknown (not invented)",
  },
] as const;

export function destinationsForMode(mode: LaneMode): DestinationOption[] {
  return DESTINATIONS.filter((d) => d.mode === mode);
}

export function defaultDestination(mode: LaneMode): DestinationOption {
  return mode === "export" ? DESTINATIONS.find((d) => d.id === "AEJEA")! : DESTINATIONS.find((d) => d.id === "chennai")!;
}

export function destinationSelectOptions(mode: LaneMode): SelectOption<string>[] {
  return destinationsForMode(mode).map((d) => ({ value: d.id, label: d.label }));
}

/** Lat/lng for map “from → to” (not live AIS). Domestic ids match `PORTS`. */
export interface MapDestinationPoint {
  readonly id: string;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
}

export const OVERSEAS_MAP_DESTINATIONS: Readonly<
  Record<"AEJEA" | "USGEN", MapDestinationPoint>
> = {
  AEJEA: {
    id: "AEJEA",
    label: "Jebel Ali (Dubai, UAE)",
    lat: 25.0118,
    lng: 55.0618,
  },
  USGEN: {
    id: "USGEN",
    label: "USA (Long Beach stub)",
    lat: 33.7361,
    lng: -118.2636,
  },
};

export function resolveMapDestination(
  destinationId: string,
  domesticPorts: ReadonlyArray<{ id: string; name: string; code: string; lat: number; lng: number }>,
): MapDestinationPoint | null {
  if (destinationId === "AEJEA" || destinationId === "USGEN") {
    return OVERSEAS_MAP_DESTINATIONS[destinationId];
  }
  const port = domesticPorts.find((p) => p.id === destinationId);
  if (!port) return null;
  return {
    id: port.id,
    label: `${port.name} (${port.code})`,
    lat: port.lat,
    lng: port.lng,
  };
}
