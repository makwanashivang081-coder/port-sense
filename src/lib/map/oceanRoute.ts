/**
 * Illustrative sea-lane polylines (not AIS tracks).
 * Avoids straight chords that cut across the Indian landmass.
 */
export type LatLng = readonly [number, number];

const INDIA_TIP: LatLng = [7.2, 77.6];
const MALACCA: LatLng = [4.0, 100.0];
const N_PACIFIC: LatLng = [30.0, -160.0];

function isWestCoast(lng: number): boolean {
  return lng < 76.5;
}

function offshoreBump(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): LatLng {
  const midLat = (a.lat + b.lat) / 2;
  const west = isWestCoast(a.lng) && isWestCoast(b.lng);
  const offshoreLng = west
    ? Math.min(a.lng, b.lng) - 1.8
    : Math.max(a.lng, b.lng) + 1.8;
  return [midLat, offshoreLng];
}

/** Build a dashed “ocean” path from origin to destination for the map. */
export function buildOceanRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): LatLng[] {
  const start: LatLng = [from.lat, from.lng];
  const end: LatLng = [to.lat, to.lng];

  // Jebel Ali / Gulf (illustrative Arabian Sea route)
  if (to.lng >= 50 && to.lng <= 60 && to.lat >= 22 && to.lat <= 28) {
    if (isWestCoast(from.lng)) {
      return [start, [from.lat - 0.5, 66], [20, 60], [23.5, 57], end];
    }
    return [
      start,
      [from.lat - 2, from.lng + 1],
      [10, from.lng],
      INDIA_TIP,
      [12, 65],
      [22, 58],
      end,
    ];
  }

  // USA stub (illustrative via south tip → Malacca → Pacific — not a real schedule)
  if (to.lng < 0) {
    const leaveWest = isWestCoast(from.lng);
    return leaveWest
      ? [start, INDIA_TIP, MALACCA, [15, 150], N_PACIFIC, [32, -130], end]
      : [start, [10, from.lng + 2], MALACCA, [15, 150], N_PACIFIC, [32, -130], end];
  }

  // Domestic India: same coast → stay offshore; opposite coasts → around India tip
  const sameCoast = isWestCoast(from.lng) === isWestCoast(to.lng);
  if (sameCoast) {
    return [start, offshoreBump(from, to), end];
  }

  if (isWestCoast(from.lng)) {
    return [
      start,
      [from.lat - 1.5, from.lng - 1.2],
      [11, 72.2],
      INDIA_TIP,
      [8.2, 80.2],
      [to.lat - 1, to.lng + 1],
      end,
    ];
  }

  return [
    start,
    [from.lat - 1, from.lng + 1],
    [8.2, 80.2],
    INDIA_TIP,
    [11, 72.2],
    [to.lat - 1.5, to.lng - 1.2],
    end,
  ];
}
