import { ExplanationService } from "../application/explanation.service.js";
export function createExplanationRuntime() {
    return {
        explanation: new ExplanationService(),
    };
}
//# sourceMappingURL=runtime.js.map