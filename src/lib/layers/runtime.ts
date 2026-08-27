import "server-only";

import {
  createDecisionRuntime,
  type DecisionRuntime,
} from "@port-sense/layer3-decision";
import {
  createLaneRuntime,
  type LaneRuntime,
} from "@port-sense/layer4-decision";
import {
  createExplanationRuntime,
  type ExplanationRuntime,
} from "@port-sense/layer5-explanation";
import { createLandedRuntime, type LandedRuntime } from "@port-sense/layer6-landed";
import { resolveCanonicalSnapshotPath } from "@/lib/layers/snapshotPath";

let decisionRuntime: DecisionRuntime | null = null;
let laneRuntime: LaneRuntime | null = null;
let explanationRuntime: ExplanationRuntime | null = null;
let landedRuntime: LandedRuntime | null = null;

export function getDecisionRuntime(): DecisionRuntime {
  if (!decisionRuntime) {
    decisionRuntime = createDecisionRuntime(resolveCanonicalSnapshotPath());
  }
  return decisionRuntime;
}

export function getLaneRuntime(): LaneRuntime {
  if (!laneRuntime) {
    laneRuntime = createLaneRuntime(resolveCanonicalSnapshotPath());
  }
  return laneRuntime;
}

export function getExplanationRuntime(): ExplanationRuntime {
  if (!explanationRuntime) {
    explanationRuntime = createExplanationRuntime();
  }
  return explanationRuntime;
}

export function getLandedRuntime(): LandedRuntime {
  if (!landedRuntime) {
    landedRuntime = createLandedRuntime();
  }
  return landedRuntime;
}
