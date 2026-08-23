import type { FieldMapping } from "../domain/types.js";
/**
 * Schema Detection Engine — suggests mappings with confidence; does not assume.
 */
export declare class SchemaDetectionEngine {
    detect(columns: readonly string[]): FieldMapping[];
    /** Columns that look like a port field (for Test 7). */
    possiblePortColumns(columns: readonly string[]): string[];
}
//# sourceMappingURL=schema-detection.engine.d.ts.map