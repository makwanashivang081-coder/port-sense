import { createCanonicalClient, } from "@port-sense/layer2-canonical";
import { LaneBuilderEngine } from "../application/lane-builder.engine.js";
import { LaneComparatorEngine } from "../application/lane-comparator.engine.js";
import { DecisionEngine } from "../application/decision.engine.js";
export function createLaneRuntime(snapshotPath) {
    const client = snapshotPath !== undefined
        ? createCanonicalClient(snapshotPath)
        : createCanonicalClient();
    const builder = new LaneBuilderEngine();
    const comparator = new LaneComparatorEngine(client.data);
    const decision = new DecisionEngine(builder, comparator);
    return { client, builder, comparator, decision };
}
//# sourceMappingURL=runtime.js.map