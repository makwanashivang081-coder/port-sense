import type { CanonicalDataService } from "@port-sense/layer2-canonical";
import type { LaneDefinition, LaneEvaluateRequest, LaneScore } from "../domain/types.js";
/**
 * Lane Comparator — scores each lane via L3 Cost+Risk (read-only L2).
 * Chargeable port for demurrage/risk = origin gate (documented V1 rule).
 */
export declare class LaneComparatorEngine {
    private readonly data;
    private readonly demurrage;
    private readonly risk;
    constructor(data: CanonicalDataService);
    scoreLane(lane: LaneDefinition, req: LaneEvaluateRequest): LaneScore;
    compare(lanes: readonly LaneDefinition[], req: LaneEvaluateRequest): LaneScore[];
}
//# sourceMappingURL=lane-comparator.engine.d.ts.map