import { type CanonicalClient } from "@port-sense/layer2-canonical";
import { LaneBuilderEngine } from "../application/lane-builder.engine.js";
import { LaneComparatorEngine } from "../application/lane-comparator.engine.js";
import { DecisionEngine } from "../application/decision.engine.js";
export interface LaneRuntime {
    readonly client: CanonicalClient;
    readonly builder: LaneBuilderEngine;
    readonly comparator: LaneComparatorEngine;
    readonly decision: DecisionEngine;
}
export declare function createLaneRuntime(snapshotPath?: string): LaneRuntime;
//# sourceMappingURL=runtime.d.ts.map