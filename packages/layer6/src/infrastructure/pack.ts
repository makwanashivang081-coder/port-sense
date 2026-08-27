import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { PortId } from "@port-sense/layer2-canonical";
import type { ContainerSize } from "@port-sense/layer3-decision";
import { haversineKm } from "../domain/distance.js";
import type { DistanceBasis, InlandCity, InlandId } from "../domain/types.js";

interface PortRow {
  id: PortId;
  name: string;
  lat: number;
  lng: number;
}

interface CityRow extends InlandCity {
  corridors: Array<{ originPortId: PortId; km: number; highway: string }>;
}

interface Network {
  honestyNote: string;
  rateClass: "SECONDARY_ESTIMATE";
  rateInrPerKm: Record<string, number>;
  tollBufferPct: number;
  highwayWinding: number;
  ports: PortRow[];
  cities: CityRow[];
}

function networkPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "inland-network.json");
}

let cached: Network | null = null;

export function loadNetwork(): Network {
  cached ??= JSON.parse(readFileSync(networkPath(), "utf8")) as Network;
  return cached;
}

export function listCities(): InlandCity[] {
  return loadNetwork().cities.map((c) => ({
    inlandId: c.inlandId,
    label: c.label,
    lat: c.lat,
    lng: c.lng,
  }));
}

export function getCity(inlandId: InlandId): CityRow {
  const city = loadNetwork().cities.find((c) => c.inlandId === inlandId);
  if (!city) throw new Error(`Unknown inland city ${inlandId}`);
  return city;
}

export function ratePerKm(size: ContainerSize): number {
  const rate = loadNetwork().rateInrPerKm[size];
  if (rate === undefined) throw new Error(`No inland ₹/km for ${size}`);
  return rate;
}

export function resolveKm(
  originPortId: PortId,
  inlandId: InlandId,
): { km: number; highway: string; basis: DistanceBasis } {
  const net = loadNetwork();
  const city = getCity(inlandId);
  const table = city.corridors.find((c) => c.originPortId === originPortId);
  if (table) {
    return { km: table.km, highway: table.highway, basis: "highway_table" };
  }
  const port = net.ports.find((p) => p.id === originPortId);
  if (!port) {
    throw new Error(`No coordinates for origin ${originPortId}`);
  }
  const km = Math.round(haversineKm(port, city) * net.highwayWinding);
  return {
    km,
    highway: `Estimated road (${net.highwayWinding}× great-circle)`,
    basis: "haversine_winding",
  };
}
