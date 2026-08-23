import type { ValidationStatus } from "../domain/types.js";
import type { NormalizedValue } from "../domain/types.js";
export interface ValidationInput {
    readonly waitingTime: NormalizedValue | null;
    readonly freeDays: NormalizedValue | null;
    readonly vesselCount: string | null;
    readonly observationDate: string | null;
    readonly portResolved: boolean;
    readonly distance: NormalizedValue | null;
}
export interface ValidationOutcome {
    readonly status: ValidationStatus;
    readonly flags: string[];
}
/**
 * Data Validation Engine — reject/flag bad values before canonical promotion.
 */
export declare class ValidationEngine {
    validate(input: ValidationInput): ValidationOutcome;
}
//# sourceMappingURL=validation.engine.d.ts.map