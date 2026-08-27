import { LandedCostService } from "../application/landed-cost.service.js";
export function createLandedRuntime() {
    return { landed: new LandedCostService() };
}
//# sourceMappingURL=runtime.js.map