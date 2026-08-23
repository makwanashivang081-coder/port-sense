import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
export function getLayer1Root() {
    const here = dirname(fileURLToPath(import.meta.url));
    return join(here, "..", "..");
}
/** Read last `npm run validate` report — no re-ingest. */
export function getLayer1Status(root = getLayer1Root()) {
    const reportPath = join(root, "data", "LAYER1_VALIDATION_REPORT.json");
    const rawDir = join(root, "data", "raw");
    let report = null;
    if (existsSync(reportPath)) {
        report = JSON.parse(readFileSync(reportPath, "utf8"));
    }
    const rawArtifactCount = existsSync(rawDir)
        ? readdirSync(rawDir).filter((f) => !f.startsWith(".")).length
        : 0;
    const counts = report?.counts ?? null;
    const ready = Boolean(counts && counts.failed === 0 && counts.errors === 0 && counts.passed > 0);
    return {
        layer: "layer1",
        ready,
        lastValidateAt: report?.generatedAt ?? null,
        decision: report?.decision ?? null,
        validationCounts: counts,
        rawArtifactCount,
        reportPath,
    };
}
//# sourceMappingURL=status.js.map