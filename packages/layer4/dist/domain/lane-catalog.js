/**
 * Fixed V1 lane catalog — domestic IN→IN + export gates.
 * Transit days only when sourced; otherwise null (insufficient).
 */
export const LANE_CATALOG = [
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
    // —— Export → USA stub ——
    ...gatedExport("USGEN", "USA (generic stub)", [
        "INNSA",
        "INMUN",
        "INMAA",
        "INCOK",
    ]),
];
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
        INMUN: "Mundra",
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