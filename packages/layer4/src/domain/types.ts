import type { PortId } from "@port-sense/layer2-canonical";

export type LaneType = "domestic" | "export";

export type DestinationCode = "AEJEA" | "USGEN" | PortId;

export interface LaneDefinition {
  readonly laneId: string;
  readonly type: LaneType;
  readonly originPortId: PortId;
  /** Domestic: Indian port. Export: use destinationCode. */
  readonly destinationPortId?: PortId;
  readonly destinationCode?: Exclude<DestinationCode, PortId>;
  readonly label: string;
  /** null = insufficient sourced transit — never invent */
  readonly transitDays: number | null;
  readonly transitSource: string | null;
}

export type DecisionPriority =
  | "lowest_cost"
  | "fastest"
  | "lowest_risk"
  | "balanced";

export interface LaneEvaluateRequest {
  readonly carrierId: import("@port-sense/layer2-canonical").CarrierId;
  readonly containerSize?: import("@port-sense/layer3-decision").ContainerSize;
  readonly containerCount?: number;
  /** Applied to every candidate origin for fair what-if compare */
  readonly dwellHoursOverride?: number;
  readonly direction?: "export" | "import";
  readonly priority?: DecisionPriority;
}

export interface LaneScore {
  readonly lane: LaneDefinition;
  readonly originName: string;
  readonly demurrageInr: number;
  readonly riskLevel: "low" | "medium" | "high";
  readonly riskScore: number;
  readonly transitDays: number | null;
  readonly tariffFactId: string;
  readonly dwellFactId: string | null;
  readonly sourceCitation: string;
  readonly status: "ok" | "insufficient_data";
  readonly insufficientReason?: string;
}

export interface LaneDecisionResult {
  readonly request: LaneEvaluateRequest;
  readonly destinationLabel: string;
  readonly candidates: readonly LaneScore[];
  readonly ranked: readonly LaneScore[];
  readonly winner: LaneScore | null;
  readonly runnerUp: LaneScore | null;
  /** Positive = winner cheaper than runner-up on demurrage */
  readonly saveInrVsRunnerUp: number | null;
  readonly recommendation: string;
  readonly honestyNote: string;
  readonly evaluatedAt: string;
}

export class LaneDecisionError extends Error {
  readonly code = "LANE_DECISION" as const;
  constructor(message: string) {
    super(message);
    this.name = "LaneDecisionError";
  }
}
