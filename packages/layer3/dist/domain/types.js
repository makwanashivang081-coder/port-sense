export class DecisionValidationError extends Error {
    code = "DECISION_VALIDATION";
    constructor(message) {
        super(message);
        this.name = "DecisionValidationError";
    }
}
export class DecisionDataError extends Error {
    code = "DECISION_DATA";
    constructor(message) {
        super(message);
        this.name = "DecisionDataError";
    }
}
//# sourceMappingURL=types.js.map