/**
 * Resolve the default canonical snapshot relative to this package.
 * Layer 3+ should prefer this helper over hardcoding absolute paths.
 */
export declare function getLayer2Root(): string;
export declare function getDefaultSnapshotPath(): string;
export declare function getVerifiedDataRoot(repoRoot?: string): string;
export declare function assertSnapshotExists(path?: string): string;
//# sourceMappingURL=paths.d.ts.map