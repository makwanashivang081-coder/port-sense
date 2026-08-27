import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { haversineKm } from "../domain/distance.js";
function networkPath() {
    return join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "inland-network.json");
}
let cached = null;
export function loadNetwork() {
    cached ??= JSON.parse(readFileSync(networkPath(), "utf8"));
    return cached;
}
export function listCities() {
    return loadNetwork().cities.map((c) => ({
        inlandId: c.inlandId,
        label: c.label,
        lat: c.lat,
        lng: c.lng,
    }));
}
export function getCity(inlandId) {
    const city = loadNetwork().cities.find((c) => c.inlandId === inlandId);
    if (!city)
        throw new Error(`Unknown inland city ${inlandId}`);
    return city;
}
export function ratePerKm(size) {
    const rate = loadNetwork().rateInrPerKm[size];
    if (rate === undefined)
        throw new Error(`No inland ₹/km for ${size}`);
    return rate;
}
export function resolveKm(originPortId, inlandId) {
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
//# sourceMappingURL=pack.js.map