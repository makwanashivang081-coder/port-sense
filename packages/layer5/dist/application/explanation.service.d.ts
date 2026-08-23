import type { ExplanationResult, LaneExplainInput, OriginExplainInput } from "../domain/types.js";
/**
 * Template Explanation Engine — formats L3/L4 evidence for humans.
 * Does not call an LLM and does not recompute demurrage.
 */
export declare class ExplanationService {
    explainOrigin(input: OriginExplainInput): ExplanationResult;
    explainLane(input: LaneExplainInput): ExplanationResult;
}
//# sourceMappingURL=explanation.service.d.ts.map