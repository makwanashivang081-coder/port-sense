export declare class CanonicalNotFoundError extends Error {
    readonly resource: string;
    readonly id: string;
    readonly code: "CANONICAL_NOT_FOUND";
    constructor(resource: string, id: string);
}
export declare class AcceptanceRejectedError extends Error {
    readonly reason: string;
    readonly batchId?: string | undefined;
    readonly code: "ACCEPTANCE_REJECTED";
    constructor(reason: string, batchId?: string | undefined);
}
export declare class StoreNotLoadedError extends Error {
    readonly code: "STORE_NOT_LOADED";
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map