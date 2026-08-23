export function toLayer2IngestionResult(batch) {
    const entities = [];
    const facts = [];
    for (const rec of batch.records) {
        if (rec.status === "DUPLICATE" || rec.status === "INVALID")
            continue;
        if (!rec.canonicalPortId)
            continue;
        entities.push({
            candidateId: `ent_${rec.recordId}`,
            entityType: "port",
            proposedId: rec.canonicalPortId,
            displayName: String(rec.mapped.port_name ?? rec.canonicalPortId),
            status: rec.status === "SUSPICIOUS" ? "SUSPICIOUS" : "VALID",
            confidence: rec.portResolutionConfidence,
        });
        const waiting = rec.mapped.waiting_time;
        const days = waiting && typeof waiting.normalized === "number" ? waiting.normalized : null;
        if (days === null)
            continue;
        const asOf = String(rec.mapped.observation_date ?? batch.producedAt.slice(0, 10));
        facts.push({
            candidateId: `fact_${rec.recordId}`,
            factKind: "dwell_snapshot",
            payload: {
                portId: rec.canonicalPortId,
                exportPortHours: days * 24,
                importPortHours: null,
                periodLabel: asOf,
                originalWaiting: waiting,
            },
            status: rec.status === "SUSPICIOUS" ? "SUSPICIOUS" : "VALID",
            confidence: 0.85,
            asOf,
        });
    }
    return {
        batchId: batch.batchId,
        producedAt: batch.producedAt,
        decision: batch.decision,
        provenance: {
            rawArtifactId: batch.artifact.artifactId,
            ...(batch.artifact.sourceUrl !== undefined
                ? { sourceUri: batch.artifact.sourceUrl }
                : {}),
            ...(batch.artifact.publisher !== undefined
                ? { publisher: batch.artifact.publisher }
                : {}),
            capturedAt: batch.artifact.capturedAt,
            contentHash: batch.artifact.contentHash,
        },
        entities,
        facts,
        reviewNotes: batch.reviewNotes,
    };
}
/** Deduplicate entity candidates by proposedId for cleaner L2 batches. */
export function summarizeBridge(batch) {
    const result = toLayer2IngestionResult(batch);
    return {
        validRows: batch.records.filter((r) => r.status === "VALID").length,
        factCandidates: result.facts.length,
    };
}
//# sourceMappingURL=bridge-to-layer2.js.map