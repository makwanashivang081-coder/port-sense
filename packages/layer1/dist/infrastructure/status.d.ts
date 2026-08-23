export declare function getLayer1Root(): string;
export interface Layer1StatusSummary {
    readonly layer: "layer1";
    readonly ready: boolean;
    readonly lastValidateAt: string | null;
    readonly decision: string | null;
    readonly validationCounts: {
        passed: number;
        failed: number;
        errors: number;
        total: number;
    } | null;
    readonly rawArtifactCount: number;
    readonly reportPath: string;
}
/** Read last `npm run validate` report — no re-ingest. */
export declare function getLayer1Status(root?: string): Layer1StatusSummary;
//# sourceMappingURL=status.d.ts.map