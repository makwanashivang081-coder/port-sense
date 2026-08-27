import { ExplanationService } from "../application/explanation.service.js";
import { AdvisorService } from "../application/advisor.service.js";
export function createExplanationRuntime() {
    return {
        explanation: new ExplanationService(),
        advisor: new AdvisorService(),
    };
}
//# sourceMappingURL=runtime.js.map