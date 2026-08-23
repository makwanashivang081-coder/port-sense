import type { PortId } from "@port-sense/layer2-canonical";
import type { CanonicalDataService } from "@port-sense/layer2-canonical";
export declare const ESTIMATE_MODEL_VERSION: "estimate-v1-congestion";
export declare const ESTIMATE_INTERVAL_MINUTES = 15;
export interface DwellEstimateSnapshot {
    readonly portId: PortId;
    readonly baselineHours: number;
    readonly congestionBufferHours: number;
    readonly estimatedHours: number;
    readonly periodKey: string | null;
    readonly baselineFactId: string | null;
    readonly modelVersion: typeof ESTIMATE_MODEL_VERSION;
    readonly recomputedAt: string;
    readonly nextRecomputeAt: string;
    readonly sources: readonly string[];
    readonly honestyNote: string;
}
/**
 * Port Sense dwell estimate = published L2 dwell + congestion buffer.
 * Money still uses verified tariff slabs; only dwell hours are estimated.
 */
export declare class DwellEstimateService {
    private readonly data;
    constructor(data: CanonicalDataService);
    bufferHours(portId: PortId): number;
    estimateExportDwell(portId: PortId, now?: Date): DwellEstimateSnapshot;
}
//# sourceMappingURL=dwell-estimate.service.d.ts.map