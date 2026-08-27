import type { SelectOption } from "@/components/ui/Field";

export type LaneMode = "domestic" | "export" | "inland";

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
    label: "USA",
    hint: "Same Indian-origin demurrage as Dubai — ocean days unknown (not invented)",
  },
  {
    id: "surat",
    mode: "inland",
    apiValue: "IN_SURAT",
    label: "Surat",
    hint: "Waiting fee + truck to Surat",
  },
  {
    id: "ahmedabad",
    mode: "inland",
    apiValue: "IN_AHMEDABAD",
    label: "Ahmedabad",
    hint: "Waiting fee + truck to Ahmedabad",
  },
  {
    id: "pune",
    mode: "inland",
    apiValue: "IN_PUNE",
    label: "Pune",
    hint: "Waiting fee + truck to Pune",
  },
  {
    id: "delhi",
    mode: "inland",
    apiValue: "IN_DELHI",
    label: "Delhi NCR",
    hint: "Waiting fee + truck to Delhi",
  },
  {
    id: "hyderabad",
    mode: "inland",
    apiValue: "IN_HYD",
    label: "Hyderabad",
    hint: "Waiting fee + truck to Hyderabad",
  },
  {
    id: "bengaluru",
    mode: "inland",
    apiValue: "IN_BLR",
    label: "Bengaluru",
    hint: "Waiting fee + truck to Bengaluru",
  },
] as const;

export function destinationsForMode(mode: LaneMode): DestinationOption[] {
  return DESTINATIONS.filter((d) => d.mode === mode);
}

export function defaultDestination(mode: LaneMode): DestinationOption {
  if (mode === "export") return DESTINATIONS.find((d) => d.id === "AEJEA")!;
  if (mode === "inland") return DESTINATIONS.find((d) => d.id === "surat")!;
  return DESTINATIONS.find((d) => d.id === "chennai")!;
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
  Record<"AEJEA" | "USGEN" | "surat" | "ahmedabad" | "pune" | "delhi" | "hyderabad" | "bengaluru", MapDestinationPoint>
> = {
  AEJEA: {
    id: "AEJEA",
    label: "Dubai (Jebel Ali)",
    lat: 25.0118,
    lng: 55.0618,
  },
  USGEN: {
    id: "USGEN",
    label: "USA",
    lat: 33.7361,
    lng: -118.2636,
  },
  surat: { id: "surat", label: "Surat", lat: 21.1702, lng: 72.8311 },
  ahmedabad: { id: "ahmedabad", label: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  pune: { id: "pune", label: "Pune", lat: 18.5204, lng: 73.8567 },
  delhi: { id: "delhi", label: "Delhi NCR", lat: 28.6139, lng: 77.209 },
  hyderabad: { id: "hyderabad", label: "Hyderabad", lat: 17.385, lng: 78.4867 },
  bengaluru: { id: "bengaluru", label: "Bengaluru", lat: 12.9716, lng: 77.5946 },
};

export function resolveMapDestination(
  destinationId: string,
  domesticPorts: ReadonlyArray<{ id: string; name: string; code: string; lat: number; lng: number }>,
): MapDestinationPoint | null {
  if (
    destinationId === "AEJEA" ||
    destinationId === "USGEN" ||
    destinationId === "surat" ||
    destinationId === "ahmedabad" ||
    destinationId === "pune" ||
    destinationId === "delhi" ||
    destinationId === "hyderabad" ||
    destinationId === "bengaluru"
  ) {
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
