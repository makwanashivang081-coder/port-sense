import { JsonCanonicalStore } from "./json-store.js";
import { CanonicalDataService } from "../application/canonical-data.service.js";
import { AcceptanceService } from "../application/acceptance.service.js";
export interface CanonicalClient {
    readonly store: JsonCanonicalStore;
    readonly data: CanonicalDataService;
    readonly acceptance: AcceptanceService;
    readonly snapshotPath: string;
}
/** Preferred factory for Layer 3+ — load once, query many times. */
export declare function createCanonicalClient(snapshotPath?: string): CanonicalClient;
//# sourceMappingURL=canonical-client.d.ts.map