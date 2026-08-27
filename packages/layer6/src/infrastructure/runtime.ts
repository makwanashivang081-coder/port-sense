import { LandedCostService } from "../application/landed-cost.service.js";

export interface LandedRuntime {
  readonly landed: LandedCostService;
}

export function createLandedRuntime(): LandedRuntime {
  return { landed: new LandedCostService() };
}
