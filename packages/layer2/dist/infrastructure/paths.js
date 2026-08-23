import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
/**
 * Resolve the default canonical snapshot relative to this package.
 * Layer 3+ should prefer this helper over hardcoding absolute paths.
 */
export function getLayer2Root() {
    const here = dirname(fileURLToPath(import.meta.url));
    // src/infrastructure → layer2 root
    return join(here, "..", "..");
}
export function getDefaultSnapshotPath() {
    return join(getLayer2Root(), "data", "canonical-snapshot.json");
}
export function getVerifiedDataRoot(repoRoot) {
    const root = repoRoot ?? join(getLayer2Root(), "..");
    return join(root, "data accurate", "01-verified");
}
export function assertSnapshotExists(path = getDefaultSnapshotPath()) {
    if (!existsSync(path)) {
        throw new Error(`Canonical snapshot missing at ${path}. Run: cd layer2 && npm run seed`);
    }
    return path;
}
//# sourceMappingURL=paths.js.map