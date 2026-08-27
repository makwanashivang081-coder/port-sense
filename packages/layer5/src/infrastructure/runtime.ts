import { ExplanationService } from "../application/explanation.service.js";
import { AdvisorService } from "../application/advisor.service.js";

export interface ExplanationRuntime {
  readonly explanation: ExplanationService;
  readonly advisor: AdvisorService;
}

export function createExplanationRuntime(): ExplanationRuntime {
  return {
    explanation: new ExplanationService(),
    advisor: new AdvisorService(),
  };
}
