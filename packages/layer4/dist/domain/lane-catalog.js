const MODELLED_GATES = [
    { id: "INNSA", short: "JNPT" },
    { id: "INMAA", short: "Chennai" },
    { id: "INCOK", short: "Cochin" },
    { id: "INVTZ", short: "Vizag" },
    { id: "INCCU", short: "Kolkata" },
];
/**
 * Fixed V1 lane catalog — domestic IN→IN + export gates.
 * Transit days only when sourced; otherwise null (insufficient).
 * Mundra (INMUN) is a private port and is not a product origin.
 */
export const LANE_CATALOG = [
    ...domesticMesh(),
    ...gatedExport("AEJEA", "Jebel Ali", MODELLED_GATES.map((g) => g.id)),
    ...gatedExport("USGEN", "Los Angeles", MODELLED_GATES.map((g) => g.id)),
    ...gatedExport("SGSIN", "Singapore", MODELLED_GATES.map((g) => g.id)),
    ...gatedExport("NLRTM", "Rotterdam", MODELLED_GATES.map((g) => g.id)),
    ...gatedExport("LKCMB", "Colombo", MODELLED_GATES.map((g) => g.id)),
];
function domesticMesh() {
    const lanes = [];
    for (const origin of MODELLED_GATES) {
        for (const dest of MODELLED_GATES) {
            if (origin.id === dest.id)
                continue;
            lanes.push({
                laneId: `dom:${origin.id}-${dest.id}`,
                type: "domestic",
                originPortId: origin.id,
                destinationPortId: dest.id,
                label: `${origin.short} → ${dest.short}`,
                transitDays: null,
                transitSource: null,
            });
        }
    }
    return lanes;
}
function gatedExport(code, destLabel, origins) {
    return origins.map((originPortId) => ({
        laneId: `exp:${originPortId}-${code}`,
        type: "export",
        originPortId,
        destinationCode: code,
        label: `${portShort(originPortId)} → ${destLabel}`,
        transitDays: null,
        transitSource: null,
    }));
}
function portShort(id) {
    const map = {
        INNSA: "JNPT",
        INMAA: "Chennai",
        INCOK: "Cochin",
        INVTZ: "Vizag",
        INCCU: "Kolkata",
        INDEE: "Deendayal",
    };
    return map[id] ?? id;
}
export function destinationKey(lane) {
    if (lane.type === "domestic")
        return `port:${lane.destinationPortId}`;
    return `code:${lane.destinationCode}`;
}
//# sourceMappingURL=lane-catalog.js.map