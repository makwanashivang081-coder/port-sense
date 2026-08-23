import type { CarrierId, PortId } from "@port-sense/layer2-canonical";
export type ContainerSize = "20ft" | "40ft" | "40hc";
export interface DecisionInput {
    readonly portId: PortId;
    readonly carrierId: CarrierId;
    readonly direction?: "export" | "import";
    readonly containerSize?: ContainerSize;
    readonly containerCount?: number;
    /** Override dwell hours; if omitted, use latest L2 published dwell. */
    readonly dwellHoursOverride?: number;
    readonly asOf?: string;
}
export type RiskLevel = "low" | "medium" | "high";
export interface DayCharge {
    readonly dayIndex: number;
    readonly rateInrPerDay: number;
    readonly currencyOriginal: "INR" | "USD";
    readonly slabLabel: string;
}
export interface DemurrageBreakdown {
    readonly freeDays: number;
    readonly dwellHours: number;
    readonly dwellDays: number;
    readonly chargeableDays: number;
    readonly billedDays: number;
    readonly dayCharges: readonly DayCharge[];
    readonly totalInr: number;
    readonly fxRateUsed: number | null;
    readonly tariffFactId: string;
    readonly currencyOriginal: "INR" | "USD";
    readonly sourceCitation: string;
}
export interface RiskAssessment {
    readonly level: RiskLevel;
    readonly score: number;
    readonly freeDays: number;
    readonly dwellDays: number;
    readonly excessDays: number;
    readonly dwellFactId: string | null;
    readonly dwellPeriod: string | null;
    readonly explanation: string;
}
export interface DecisionResult {
    readonly input: Required<Pick<DecisionInput, "portId" | "carrierId" | "direction" | "containerSize" | "containerCount">> & {
        dwellHours: number;
        asOf: string | null;
    };
    readonly portName: string;
    readonly carrierName: string;
    readonly demurrage: DemurrageBreakdown;
    readonly risk: RiskAssessment;
    readonly recommendation: string;
    readonly evaluatedAt: string;
    readonly honestyNote: string;
}
export declare class DecisionValidationError extends Error {
    readonly code: "DECISION_VALIDATION";
    constructor(message: string);
}
export declare class DecisionDataError extends Error {
    readonly code: "DECISION_DATA";
    constructor(message: string);
}
//# sourceMappingURL=types.d.ts.map