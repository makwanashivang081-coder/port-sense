import type { LaneDefinition } from "../domain/types.js";
/**
 * Fixed V1 lane catalog — domestic IN→IN + export gates.
 * Transit days only when sourced; otherwise null (insufficient).
 */
export declare const LANE_CATALOG: readonly LaneDefinition[];
export declare function destinationKey(lane: LaneDefinition): string;
//# sourceMappingURL=lane-catalog.d.ts.map