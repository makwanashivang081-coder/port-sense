/** Layer 1 domain types — independent of Layer 2 storage. */
export class IngestionError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.name = "IngestionError";
        this.code = code;
    }
}
export const TRANSFORMATION_VERSION = "layer1-ingest-v1.0.0";
//# sourceMappingURL=types.js.map