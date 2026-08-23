import type { CanonicalDataService, PortId } from "@port-sense/layer2-canonical";
import type { DecisionInput, DecisionResult } from "../domain/types.js";
import { DemurrageService } from "./demurrage.service.js";
import { RiskService } from "./risk.service.js";
export declare class DecisionService {
    private readonly data;
    private readonly demurrage;
    private readonly risk;
    constructor(data: CanonicalDataService, demurrage?: DemurrageService, risk?: RiskService);
    evaluate(input: DecisionInput): DecisionResult;
    comparePorts(input: Omit<DecisionInput, "portId">): Array<{
        portId: PortId;
        portName: string;
        totalInr: number;
        riskLevel: string;
    }>;
    private evaluateInternal;
    private cheapestAlternative;
}
//# sourceMappingURL=decision.service.d.ts.map