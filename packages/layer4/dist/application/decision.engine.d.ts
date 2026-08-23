import type { PortId } from "@port-sense/layer2-canonical";
import type { LaneEvaluateRequest, LaneDecisionResult } from "../domain/types.js";
import { LaneBuilderEngine } from "./lane-builder.engine.js";
import { LaneComparatorEngine } from "./lane-comparator.engine.js";
/**
 * Decision Engine — picks preferred lane under user priority.
 * Never invents data for insufficient lanes.
 */
export declare class DecisionEngine {
    private readonly builder;
    private readonly comparator;
    constructor(builder: LaneBuilderEngine, comparator: LaneComparatorEngine);
    decideForDestination(dest: {
        destinationPortId?: PortId;
        destinationCode?: "AEJEA" | "USGEN";
    }, req: LaneEvaluateRequest): LaneDecisionResult;
    private compareByPriority;
}
export declare function assertNoDuplicateLanes(lanes: readonly {
    laneId: string;
}[]): void;
//# sourceMappingURL=decision.engine.d.ts.map