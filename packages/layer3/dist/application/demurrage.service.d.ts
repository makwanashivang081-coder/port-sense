import type { CanonicalDataService } from "@port-sense/layer2-canonical";
import type { DecisionInput, DemurrageBreakdown } from "../domain/types.js";
import type { DwellEstimateService } from "./dwell-estimate.service.js";
export declare class DemurrageService {
    private readonly data;
    private readonly estimate;
    constructor(data: CanonicalDataService, estimate?: DwellEstimateService | null);
    resolveDwellHours(input: DecisionInput): {
        hours: number;
        factId: string | null;
        period: string | null;
    };
    price(input: DecisionInput): DemurrageBreakdown & {
        dwellFactId: string | null;
        dwellPeriod: string | null;
    };
}
//# sourceMappingURL=demurrage.service.d.ts.map