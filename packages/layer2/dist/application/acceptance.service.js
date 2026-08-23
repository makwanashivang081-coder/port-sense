import { AcceptanceRejectedError } from "../domain/errors.js";
/**
 * Gate: only APPROVED / PARTIALLY_APPROVED L1 batches may mutate the store.
 * Payload → CanonicalFact mapping is intentionally narrow until L1 ships.
 */
export class AcceptanceService {
    store;
    constructor(store) {
        this.store = store;
    }
    accept(result) {
        if (result.decision !== "APPROVED" &&
            result.decision !== "PARTIALLY_APPROVED") {
            throw new AcceptanceRejectedError(`Batch ${result.batchId} decision=${result.decision} — not acceptable`, result.batchId);
        }
        const acceptedFactIds = [];
        const skippedCandidateIds = [];
        const toAppend = [];
        for (const candidate of result.facts) {
            if (candidate.status === "INVALID") {
                skippedCandidateIds.push(candidate.candidateId);
                continue;
            }
            if (result.decision === "PARTIALLY_APPROVED" &&
                candidate.status === "SUSPICIOUS") {
                skippedCandidateIds.push(candidate.candidateId);
                continue;
            }
            const mapped = tryMapCandidate(candidate, result.batchId);
            if (!mapped) {
                skippedCandidateIds.push(candidate.candidateId);
                continue;
            }
            toAppend.push(mapped);
            acceptedFactIds.push(mapped.factId);
        }
        if (toAppend.length > 0) {
            this.store.appendFacts(toAppend);
        }
        return {
            batchId: result.batchId,
            acceptedFactIds,
            skippedCandidateIds,
        };
    }
}
function tryMapCandidate(candidate, batchId) {
    const p = candidate.payload;
    const provenance = {
        sourcePath: `ingestion/${batchId}/${candidate.candidateId}`,
        publisher: "layer1-ingestion",
        proofFiles: [],
        fetchedAt: candidate.asOf,
        verificationStatus: "PROVISIONAL",
        note: "Accepted via IngestionResult — pending human verification upgrade",
    };
    if (candidate.factKind === "fx") {
        const rate = Number(p.rate);
        if (!Number.isFinite(rate))
            return null;
        return {
            factId: `fx:USDINR:${candidate.asOf}:ingest:${candidate.candidateId}`,
            kind: "fx",
            version: 1,
            asOf: candidate.asOf,
            trustTier: "PROVISIONAL",
            provenance,
            pair: "USDINR",
            rate,
            quoteCurrency: "INR",
            baseCurrency: "USD",
        };
    }
    if (candidate.factKind === "dwell_snapshot") {
        const portId = String(p.portId ?? "");
        const exportPortHours = Number(p.exportPortHours);
        if (!portId || !Number.isFinite(exportPortHours))
            return null;
        const importPortHours = p.importPortHours === null || p.importPortHours === undefined
            ? null
            : Number(p.importPortHours);
        return {
            factId: `dwell_snapshot:${portId}:${candidate.asOf}:ingest:${candidate.candidateId}`,
            kind: "dwell_snapshot",
            version: 1,
            asOf: candidate.asOf,
            trustTier: "PROVISIONAL",
            provenance,
            portId: portId,
            periodLabel: String(p.periodLabel ?? candidate.asOf),
            importPortHours: Number.isFinite(importPortHours)
                ? importPortHours
                : null,
            exportPortHours,
            metricSource: "OTHER",
        };
    }
    return null;
}
//# sourceMappingURL=acceptance.service.js.map