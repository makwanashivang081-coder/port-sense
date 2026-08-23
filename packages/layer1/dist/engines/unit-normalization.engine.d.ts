import type { NormalizedValue } from "../domain/types.js";
/**
 * Unit Normalization Engine — convert to internal standards; keep originals.
 * waiting_time → days
 * distance → km
 */
export declare class UnitNormalizationEngine {
    normalizeWaitingTime(raw: string): NormalizedValue;
    normalizeDistance(raw: string): NormalizedValue;
    normalizeFreeDays(raw: string): NormalizedValue;
}
//# sourceMappingURL=unit-normalization.engine.d.ts.map