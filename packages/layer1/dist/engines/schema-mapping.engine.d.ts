import type { CanonicalField, FieldMapping, TabularDataset } from "../domain/types.js";
export interface MappedRow {
    readonly rowIndex: number;
    readonly raw: Record<string, string>;
    /** canonical field → raw cell string (pre-normalization) */
    readonly values: Partial<Record<CanonicalField, string>>;
}
/**
 * Schema Mapping Engine — applies detection into canonical field bag per row.
 */
export declare class SchemaMappingEngine {
    private readonly detector;
    mapDataset(dataset: TabularDataset): {
        mappings: FieldMapping[];
        rows: MappedRow[];
        missingRequired: CanonicalField[];
    };
}
//# sourceMappingURL=schema-mapping.engine.d.ts.map