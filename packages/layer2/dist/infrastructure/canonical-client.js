import { JsonCanonicalStore } from "./json-store.js";
import { CanonicalDataService } from "../application/canonical-data.service.js";
import { AcceptanceService } from "../application/acceptance.service.js";
import { assertSnapshotExists, getDefaultSnapshotPath, } from "./paths.js";
/** Preferred factory for Layer 3+ — load once, query many times. */
export function createCanonicalClient(snapshotPath = getDefaultSnapshotPath()) {
    const path = assertSnapshotExists(snapshotPath);
    const store = new JsonCanonicalStore();
    store.loadFromFile(path);
    return {
        store,
        data: new CanonicalDataService(store),
        acceptance: new AcceptanceService(store),
        snapshotPath: path,
    };
}
//# sourceMappingURL=canonical-client.js.map