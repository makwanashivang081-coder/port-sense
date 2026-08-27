export const EXPORT_DESTINATION_CODES = [
    "AEJEA",
    "USGEN",
    "SGSIN",
    "NLRTM",
    "LKCMB",
];
export function isExportDestinationCode(value) {
    return EXPORT_DESTINATION_CODES.includes(value);
}
export class LaneDecisionError extends Error {
    code = "LANE_DECISION";
    constructor(message) {
        super(message);
        this.name = "LaneDecisionError";
    }
}
//# sourceMappingURL=types.js.map