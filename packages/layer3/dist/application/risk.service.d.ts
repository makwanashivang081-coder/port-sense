import type { CanonicalDataService } from "@port-sense/layer2-canonical";
import type { DecisionInput, RiskAssessment } from "../domain/types.js";
import { DemurrageService } from "./demurrage.service.js";
export declare class RiskService {
    private readonly data;
    private readonly demurrage;
    constructor(data: CanonicalDataService, demurrage?: DemurrageService);
    assess(input: DecisionInput): RiskAssessment;
}
//# sourceMappingURL=risk.service.d.ts.map