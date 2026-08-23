import type { CarrierId } from "../../domain/ids.js";
import type { CanonicalSnapshot } from "../../domain/facts.js";
export declare function buildCanonicalSnapshot(verifiedRoot: string): CanonicalSnapshot;
/** Exported for tests / debugging seed mapping. */
export declare function resolveCarrierId(name: string): CarrierId | null;
//# sourceMappingURL=build-snapshot.d.ts.map