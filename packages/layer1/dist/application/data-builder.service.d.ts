import type { IngestionBatchResult } from "../domain/types.js";
import { type IngestOptions } from "../engines/ingestion.engine.js";
export interface BuildFromFileOptions extends IngestOptions {
    readonly batchId?: string;
}
/**
 * Data Builder — orchestrates all Layer-1 engines into one batch result.
 */
export declare class DataBuilderService {
    private readonly ingest;
    private readonly mapper;
    private readonly entities;
    private readonly units;
    private readonly validator;
    private readonly provenance;
    buildFromFile(filePath: string, opts?: BuildFromFileOptions): IngestionBatchResult;
    buildFromBytes(fileName: string, bytes: Buffer, opts?: BuildFromFileOptions): IngestionBatchResult;
    private buildFromDataset;
    private rejectedBatch;
}
//# sourceMappingURL=data-builder.service.d.ts.map