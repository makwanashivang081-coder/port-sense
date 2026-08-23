import type { ProvenanceRecord, RawArtifact, ValidationStatus } from "../domain/types.js";
/**
 * Provenance Engine — every record knows who/when/from where/transforms.
 */
export declare class ProvenanceEngine {
    build(artifact: RawArtifact, validationStatus: ValidationStatus, publishedAt?: string | null): ProvenanceRecord;
    requiredKeysPresent(p: ProvenanceRecord): boolean;
}
//# sourceMappingURL=provenance.engine.d.ts.map