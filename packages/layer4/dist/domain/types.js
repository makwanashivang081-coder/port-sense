export class LaneDecisionError extends Error {
    code = "LANE_DECISION";
    constructor(message) {
        super(message);
        this.name = "LaneDecisionError";
    }
}
//# sourceMappingURL=types.js.map