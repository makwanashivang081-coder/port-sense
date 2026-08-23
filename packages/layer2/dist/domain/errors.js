export class CanonicalNotFoundError extends Error {
    resource;
    id;
    code = "CANONICAL_NOT_FOUND";
    constructor(resource, id) {
        super(`${resource} not found: ${id}`);
        this.resource = resource;
        this.id = id;
        this.name = "CanonicalNotFoundError";
    }
}
export class AcceptanceRejectedError extends Error {
    reason;
    batchId;
    code = "ACCEPTANCE_REJECTED";
    constructor(reason, batchId) {
        super(reason);
        this.reason = reason;
        this.batchId = batchId;
        this.name = "AcceptanceRejectedError";
    }
}
export class StoreNotLoadedError extends Error {
    code = "STORE_NOT_LOADED";
    constructor(message = "Canonical store is empty — run npm run seed") {
        super(message);
        this.name = "StoreNotLoadedError";
    }
}
//# sourceMappingURL=errors.js.map