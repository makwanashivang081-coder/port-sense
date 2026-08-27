export type LatLng = readonly [number, number];

const EARTH_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pathLengthKm(points: readonly LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const next = points[i]!;
    total += haversineKm({ lat: prev[0], lng: prev[1] }, { lat: next[0], lng: next[1] });
  }
  return total;
}

/** Insert points so no segment is longer than `maxStepKm` (keeps sea lanes on water). */
export function densifyPath(points: readonly LatLng[], maxStepKm = 90): LatLng[] {
  if (points.length < 2) return [...points];
  const out: LatLng[] = [points[0]!];
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const span = haversineKm({ lat: a[0], lng: a[1] }, { lat: b[0], lng: b[1] });
    const steps = Math.max(1, Math.ceil(span / maxStepKm));
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}
