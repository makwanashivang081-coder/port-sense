import type { PortId } from "@port-sense/layer2-canonical";
import type { LaneDefinition } from "../domain/types.js";
/**
 * Lane Builder — generates candidate lanes for a destination (no inventing hops).
 */
export declare class LaneBuilderEngine {
    private readonly catalog;
    constructor(catalog?: readonly LaneDefinition[]);
    /** All lanes in catalog (for inventory tests). */
    listAll(): readonly LaneDefinition[];
    /**
     * Build candidates for an export destination code or domestic destination port.
     */
    buildForDestination(dest: {
        destinationPortId?: PortId;
        destinationCode?: "AEJEA" | "USGEN";
    }): LaneDefinition[];
    /** Reject nonsense like origin === destination domestic. */
    assertValidLane(lane: LaneDefinition): void;
}
//# sourceMappingURL=lane-builder.engine.d.ts.map