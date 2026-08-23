import type { RateSlab, TariffFact } from "@port-sense/layer2-canonical";
import type { ContainerSize, DayCharge } from "./types.js";
export declare function hoursToDays(hours: number): number;
export declare function sizeRate(slab: RateSlab, size: ContainerSize): number;
/** Assign absolute day bounds when seed omitted dayFrom/dayTo. */
export declare function normalizeSlabs(freeDays: number, slabs: readonly RateSlab[]): Array<RateSlab & {
    dayFrom: number;
    dayTo: number | null;
}>;
export declare function rateForDetentionDay(tariff: TariffFact, detentionDay: number, size: ContainerSize): {
    rate: number;
    label: string;
};
export declare function buildDayCharges(params: {
    tariff: TariffFact;
    billedDays: number;
    size: ContainerSize;
    fxInrPerUsd: number | null;
}): {
    days: DayCharge[];
    currencyOriginal: "INR" | "USD";
    totalInr: number;
};
export declare function riskScoreFromExcess(excessDays: number): {
    score: number;
    level: "low" | "medium" | "high";
};
//# sourceMappingURL=demurrage-math.d.ts.map