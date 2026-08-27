import type { LaneDefinition } from "./types.js";
/**
 * Fixed V1 lane catalog — domestic IN→IN + export gates.
 * Transit days only when sourced; otherwise null (insufficient).
 * Mundra (INMUN) is a private port and is not a product origin.
 */
export declare const LANE_CATALOG: readonly LaneDefinition[];
export declare function destinationKey(lane: LaneDefinition): string;
//# sourceMappingURL=lane-catalog.d.ts.map