import type { AcceptanceOutcome, IngestionResult } from "../contracts/ingestion-result.js";
import type { JsonCanonicalStore } from "../infrastructure/json-store.js";
/**
 * Gate: only APPROVED / PARTIALLY_APPROVED L1 batches may mutate the store.
 * Payload → CanonicalFact mapping is intentionally narrow until L1 ships.
 */
export declare class AcceptanceService {
    private readonly store;
    constructor(store: JsonCanonicalStore);
    accept(result: IngestionResult): AcceptanceOutcome;
}
//# sourceMappingURL=acceptance.service.d.ts.map