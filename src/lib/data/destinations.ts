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

/** Destinations that exist in Layer-4 catalog (UI labels only — plain names). */
export const DESTINATIONS: readonly DestinationOption[] = [
  {
    id: "chennai",
    mode: "domestic",
    apiValue: "chennai",
    label: "Chennai",
    hint: "Compare Indian origins into Chennai",
  },
  {
    id: "cochin",
    mode: "domestic",
    apiValue: "cochin",
    label: "Cochin",
    hint: "Compare origins into Cochin",
  },
  {
    id: "jnpt",
    mode: "domestic",
    apiValue: "jnpt",
    label: "JNPT",
    hint: "e.g. Mundra → JNPT coastal",
  },
  {
    id: "vizag",
    mode: "domestic",
    apiValue: "vizag",
    label: "Vizag",
    hint: "Compare origins into Vizag",
  },
  {
    id: "kolkata",
    mode: "domestic",
    apiValue: "kolkata",
    label: "Kolkata",
    hint: "Compare origins into Kolkata",
  },
  {
    id: "AEJEA",
    mode: "export",
    apiValue: "AEJEA",
    label: "Dubai (Jebel Ali)",
    hint: "Indian ports → Dubai",
  },
  {
    id: "USGEN",
    mode: "export",
    apiValue: "USGEN",
    label: "Los Angeles",
    hint: "Indian ports → Los Angeles (San Pedro). Ocean days unknown — not invented.",
  },
] as const;

export function destinationsForMode(mode: LaneMode): DestinationOption[] {
  return DESTINATIONS.filter((d) => d.mode === mode);
}

export function defaultDestination(mode: LaneMode): DestinationOption {
  if (mode === "export") return DESTINATIONS.find((d) => d.id === "AEJEA")!;
  return DESTINATIONS.find((d) => d.id === "chennai")!;
}

export function destinationSelectOptions(mode: LaneMode): SelectOption<string>[] {
  return destinationsForMode(mode).map((d) => ({ value: d.id, label: d.label }));
}

/** Lat/lng for globe “from → to” (not live AIS). Domestic ids match `PORTS`. */
export interface MapDestinationPoint {
  readonly id: string;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
}

export const OVERSEAS_MAP_DESTINATIONS: Readonly<Record<"AEJEA" | "USGEN", MapDestinationPoint>> = {
  AEJEA: {
    id: "AEJEA",
    label: "Dubai (Jebel Ali)",
    lat: 25.0118,
    lng: 55.0618,
  },
  USGEN: {
    id: "USGEN",
    label: "Los Angeles",
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
  const short =
    port.id === "jnpt"
      ? "JNPT"
      : port.id === "mundra"
        ? "Mundra"
        : port.id === "chennai"
          ? "Chennai"
          : port.id === "cochin"
            ? "Cochin"
            : port.id === "vizag"
              ? "Vizag"
              : port.id === "kolkata"
                ? "Kolkata"
                : port.name;
  return {
    id: port.id,
    label: short,
    lat: port.lat,
    lng: port.lng,
  };
}
