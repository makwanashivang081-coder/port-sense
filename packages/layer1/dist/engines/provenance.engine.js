import { TRANSFORMATION_VERSION } from "../domain/types.js";
/**
 * Provenance Engine — every record knows who/when/from where/transforms.
 */
export class ProvenanceEngine {
    build(artifact, validationStatus, publishedAt = null) {
        return {
            source_id: artifact.artifactId,
            source_name: artifact.fileName,
            source_url: artifact.sourceUrl ?? null,
            retrieved_at: artifact.capturedAt,
            published_at: publishedAt,
            original_dataset: artifact.rawStoragePath ?? artifact.fileName,
            transformation_version: TRANSFORMATION_VERSION,
            validation_status: validationStatus,
            content_hash: artifact.contentHash,
        };
    }
    requiredKeysPresent(p) {
        const required = [
            "source_id",
            "source_name",
            "source_url",
            "retrieved_at",
            "published_at",
            "original_dataset",
            "transformation_version",
            "validation_status",
        ];
        // source_url and published_at may be null but keys must exist
        return required.every((k) => k in p);
    }
}
//# sourceMappingURL=provenance.engine.js.map