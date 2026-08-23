import type { RawArtifact, TabularDataset } from "../domain/types.js";
export interface IngestOptions {
    readonly sourceUrl?: string;
    readonly publisher?: string;
    readonly rawDir?: string;
    readonly persistRaw?: boolean;
}
/**
 * Data Ingestion Engine — get bytes in, preserve raw, parse tabular view.
 * Does not interpret business meaning.
 */
export declare class IngestionEngine {
    ingestFile(filePath: string, opts?: IngestOptions): {
        artifact: RawArtifact;
        dataset: TabularDataset;
    };
    ingestBytes(fileName: string, bytes: Buffer, opts?: IngestOptions): {
        artifact: RawArtifact;
        dataset: TabularDataset;
    };
}
/** Compare two tabular datasets for equivalent content (column-set + cell values). */
export declare function datasetsEquivalent(a: TabularDataset, b: TabularDataset): boolean;
//# sourceMappingURL=ingestion.engine.d.ts.map