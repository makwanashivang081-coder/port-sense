import { SchemaDetectionEngine } from "./schema-detection.engine.js";
/**
 * Schema Mapping Engine — applies detection into canonical field bag per row.
 */
export class SchemaMappingEngine {
    detector = new SchemaDetectionEngine();
    mapDataset(dataset) {
        const mappings = this.detector.detect(dataset.columns);
        const byCanonical = new Map();
        for (const m of mappings) {
            if (m.canonicalField !== "unknown" && m.confidence >= 0.8) {
                byCanonical.set(m.canonicalField, m.sourceColumn);
            }
        }
        const required = ["port_name", "observation_date", "waiting_time"];
        const missingRequired = required.filter((r) => !byCanonical.has(r));
        const rows = dataset.rows.map((raw, rowIndex) => {
            const values = {};
            for (const [field, col] of byCanonical) {
                values[field] = raw[col] ?? "";
            }
            return { rowIndex, raw, values };
        });
        return { mappings, rows, missingRequired };
    }
}
//# sourceMappingURL=schema-mapping.engine.js.map