import { densifyPath, pathLengthKm, type LatLng } from "@/lib/layer4/geo/haversine";

export type { LatLng };

export interface RoutePoint {
  readonly id?: string;
  readonly lat: number;
  readonly lng: number;
}

/**
 * Named water waypoints — studied schematic sea lanes (not AIS).
 * Points sit off the coast so great-circle hops stay in water.
 */
const WP = {
  jnptOff: [18.95, 71.85],
  cochinOff: [9.7, 75.35],
  chennaiOff: [13.05, 81.15],
  vizagOff: [17.55, 84.15],
  kolkataMouth: [20.85, 88.15],
  westMid: [14.4, 72.15],
  bay: [16.4, 87.4],
  baySouth: [11.2, 82.6],
  comorin: [6.35, 77.55],
  slSouth: [5.35, 80.15],
  laccadive: [10.4, 71.35],
  arabian: [16.6, 64.2],
  oman: [22.6, 60.4],
  hormuz: [25.15, 57.15],
  jebelApp: [25.2, 55.2],
  colomboOff: [6.55, 79.2],
  nicobar: [6.9, 93.6],
  malaccaW: [5.85, 95.55],
  malacca: [2.85, 100.55],
  singaporeApp: [1.15, 103.95],
  karimata: [2.4, 108.6],
  scs: [10.8, 112.8],
  luzonW: [17.6, 118.4],
  luzonStrait: [21.4, 121.6],
  philSea: [26.2, 136.5],
  wpac: [31.2, 155.0],
  dateline: [33.4, 175.8],
  epac: [34.1, -155.0],
  laApp: [33.65, -121.4],
  salalah: [14.7, 54.15],
  aden: [12.55, 47.4],
  bab: [13.15, 43.05],
  redSea: [20.4, 38.15],
  suezS: [27.5, 34.15],
  suezN: [31.85, 32.35],
  med: [36.2, 18.4],
  gibraltar: [35.9, -6.2],
  biscay: [45.4, -8.6],
  channel: [50.2, 0.2],
  rotterdamApp: [52.05, 3.7],
} as const satisfies Record<string, LatLng>;

function isWestCoast(lng: number, id?: string): boolean {
  if (id === "jnpt" || id === "cochin") return true;
  if (id === "chennai" || id === "vizag" || id === "kolkata") return false;
  return lng < 76.5;
}

function originOff(from: RoutePoint): LatLng {
  switch (from.id) {
    case "jnpt":
      return WP.jnptOff;
    case "cochin":
      return WP.cochinOff;
    case "chennai":
      return WP.chennaiOff;
    case "vizag":
      return WP.vizagOff;
    case "kolkata":
      return WP.kolkataMouth;
    default:
      return isWestCoast(from.lng, from.id) ? [from.lat, from.lng - 1.4] : [from.lat, from.lng + 1.4];
  }
}

function destKind(to: RoutePoint): "gulf" | "lax" | "sin" | "rtm" | "cmb" | "domestic" {
  const id = to.id ?? "";
  if (id === "AEJEA") return "gulf";
  if (id === "USGEN") return "lax";
  if (id === "SGSIN") return "sin";
  if (id === "NLRTM") return "rtm";
  if (id === "LKCMB") return "cmb";
  if (to.lng >= 50 && to.lng <= 60 && to.lat >= 22 && to.lat <= 28) return "gulf";
  if (to.lng < -100 && to.lat >= 30 && to.lat <= 36) return "lax";
  if (to.lng >= 103 && to.lng <= 105 && to.lat >= 1 && to.lat <= 2) return "sin";
  if (to.lat >= 50 && to.lng >= 3 && to.lng <= 6) return "rtm";
  if (to.lng >= 79.4 && to.lng <= 80.3 && to.lat >= 6.6 && to.lat <= 7.2) return "cmb";
  return "domestic";
}

const TO_GULF: LatLng[] = [WP.arabian, WP.oman, WP.hormuz, WP.jebelApp];
const TO_SUEZ: LatLng[] = [
  WP.salalah,
  WP.aden,
  WP.bab,
  WP.redSea,
  WP.suezS,
  WP.suezN,
  WP.med,
  WP.gibraltar,
  WP.biscay,
  WP.channel,
  WP.rotterdamApp,
];
const TO_MALACCA: LatLng[] = [WP.nicobar, WP.malaccaW, WP.malacca, WP.singaporeApp];
const TO_PACIFIC: LatLng[] = [
  WP.karimata,
  WP.scs,
  WP.luzonW,
  WP.luzonStrait,
  WP.philSea,
  WP.wpac,
  WP.dateline,
  WP.epac,
  WP.laApp,
];

function westExit(from: RoutePoint): LatLng[] {
  const off = originOff(from);
  if (from.id === "cochin") return [off, WP.laccadive];
  return [off, WP.westMid, WP.laccadive];
}

function eastExit(from: RoutePoint): LatLng[] {
  const off = originOff(from);
  if (from.id === "kolkata") return [off, WP.bay];
  return [off];
}

/** West coast → Bay of Bengal, south of Sri Lanka (does not cut the island). */
function aroundIndiaWestToEast(from: RoutePoint): LatLng[] {
  return [...westExit(from), WP.comorin, WP.slSouth, WP.baySouth];
}

/** East coast → Arabian Sea, south of Sri Lanka. */
function aroundIndiaEastToWest(from: RoutePoint): LatLng[] {
  return [...eastExit(from), WP.baySouth, WP.slSouth, WP.comorin, WP.laccadive];
}

function domesticLane(from: RoutePoint, to: RoutePoint): LatLng[] {
  const start: LatLng = [from.lat, from.lng];
  const end: LatLng = [to.lat, to.lng];
  const fromWest = isWestCoast(from.lng, from.id);
  const toWest = isWestCoast(to.lng, to.id);
  const fromOff = originOff(from);
  const toOff = originOff(to);

  if (fromWest && toWest) {
    return [start, fromOff, WP.westMid, toOff, end];
  }
  if (!fromWest && !toWest) {
    return [start, fromOff, WP.bay, toOff, end];
  }
  if (fromWest) {
    return [start, ...aroundIndiaWestToEast(from), toOff, end];
  }
  return [start, ...aroundIndiaEastToWest(from), toOff, end];
}

/** Schematic water path from origin to destination. Stays at sea; not AIS. */
export function buildOceanRoute(from: RoutePoint, to: RoutePoint): LatLng[] {
  const start: LatLng = [from.lat, from.lng];
  const end: LatLng = [to.lat, to.lng];
  const kind = destKind(to);
  const west = isWestCoast(from.lng, from.id);

  if (kind === "gulf") {
    return west
      ? [start, ...westExit(from), ...TO_GULF, end]
      : [start, ...aroundIndiaEastToWest(from), ...TO_GULF, end];
  }

  if (kind === "cmb") {
    return west
      ? [start, originOff(from), WP.comorin, WP.colomboOff, end]
      : [start, originOff(from), WP.slSouth, WP.colomboOff, end];
  }

  if (kind === "sin") {
    return west
      ? [start, ...aroundIndiaWestToEast(from), ...TO_MALACCA, end]
      : [start, ...eastExit(from), WP.baySouth, ...TO_MALACCA, end];
  }

  if (kind === "rtm") {
    return west
      ? [start, ...westExit(from), WP.arabian, ...TO_SUEZ, end]
      : [start, ...aroundIndiaEastToWest(from), WP.arabian, ...TO_SUEZ, end];
  }

  if (kind === "lax") {
    return west
      ? [start, ...aroundIndiaWestToEast(from), ...TO_MALACCA, ...TO_PACIFIC, end]
      : [start, ...eastExit(from), WP.baySouth, ...TO_MALACCA, ...TO_PACIFIC, end];
  }

  return domesticLane(from, to);
}

export function oceanRouteWithKm(
  from: RoutePoint,
  to: RoutePoint,
): { path: LatLng[]; km: number } {
  const path = densifyPath(buildOceanRoute(from, to), 55);
  return { path, km: Math.round(pathLengthKm(path)) };
}
