export type {
  ExplanationBullet,
  ExplanationEngine,
  ExplanationResult,
  OriginExplainInput,
  LaneExplainInput,
  AdvisorSheetRow,
  AdvisorResult,
  AdvisorInput,
} from "./domain/types.js";

export { ExplanationService } from "./application/explanation.service.js";
export { AdvisorService } from "./application/advisor.service.js";
export {
  createExplanationRuntime,
  type ExplanationRuntime,
} from "./infrastructure/runtime.js";

/** Friendly label for UI */
export const LAYER5_UI_LABEL = "Why these numbers" as const;
