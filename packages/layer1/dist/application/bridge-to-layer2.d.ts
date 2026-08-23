/**
 * Bridge: Layer-1 IngestionBatchResult → Layer-2 IngestionResult contract.
 * Only VALID (and optionally SUSPICIOUS) rows become FactCandidates.
 */
import type { IngestionBatchResult } from "../domain/types.js";
/** Minimal shape matching @port-sense/layer2-canonical IngestionResult */
export interface Layer2IngestionResult {
    readonly batchId: string;
    readonly producedAt: string;
    readonly decision: "APPROVED" | "PARTIALLY_APPROVED" | "REJECTED" | "QUARANTINED";
    readonly provenance: {
        readonly rawArtifactId: string;
        readonly sourceUri?: string;
        readonly publisher?: string;
        readonly capturedAt: string;
        readonly contentHash?: string;
    };
    readonly entities: readonly {
        readonly candidateId: string;
        readonly entityType: "port" | "carrier";
        readonly proposedId: string;
        readonly displayName: string;
        readonly status: "VALID" | "INVALID" | "SUSPICIOUS";
        readonly confidence: number;
    }[];
    readonly facts: readonly {
        readonly candidateId: string;
        readonly factKind: "dwell_snapshot" | "fx" | "tariff" | "dwell_monthly" | "trt";
        readonly payload: Record<string, unknown>;
        readonly status: "VALID" | "INVALID" | "SUSPICIOUS";
        readonly confidence: number;
        readonly asOf: string;
    }[];
    readonly reviewNotes?: readonly string[];
}
export declare function toLayer2IngestionResult(batch: IngestionBatchResult): Layer2IngestionResult;
/** Deduplicate entity candidates by proposedId for cleaner L2 batches. */
export declare function summarizeBridge(batch: IngestionBatchResult): {
    validRows: number;
    factCandidates: number;
};
//# sourceMappingURL=bridge-to-layer2.d.ts.map