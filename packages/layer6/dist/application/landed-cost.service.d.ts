import type { ContainerSize } from "@port-sense/layer3-decision";
import type { PortId } from "@port-sense/layer2-canonical";
import type { InlandId, InlandRoadLine, LandedCostRequest, LandedCostResult } from "../domain/types.js";
export declare class LandedCostService {
    listCities(): import("../domain/types.js").InlandCity[];
    quoteRoad(originPortId: PortId, originName: string, size: ContainerSize, count: number, inlandId?: InlandId): InlandRoadLine;
    totalize(req: LandedCostRequest): LandedCostResult;
}
//# sourceMappingURL=landed-cost.service.d.ts.map