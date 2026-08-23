import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  assertSnapshotExists,
  getDefaultSnapshotPath,
  createCanonicalClient,
} from "@port-sense/layer2-canonical";
import { createDecisionRuntime } from "@port-sense/layer3-decision";
import { createLaneRuntime, LANE_CATALOG } from "@port-sense/layer4-decision";
import { createExplanationRuntime } from "@port-sense/layer5-explanation";

export interface LayerStatusRow {
  id: string;
  name: string;
  ready: boolean;
  detail: string;
  lastAt: string | null;
}

/** Thin L1 status — read validate report only (avoid pulling ingestion/xlsx into API). */
function readLayer1Status(): {
  ready: boolean;
  lastValidateAt: string | null;
  validationCounts: {
    passed: number;
    failed: number;
    errors: number;
    total: number;
  } | null;
  rawArtifactCount: number;
} {
  const root = join(process.cwd(), "packages", "layer1");
  const reportPath = join(root, "data", "LAYER1_VALIDATION_REPORT.json");
  const rawDir = join(root, "data", "raw");

  type Report = {
    generatedAt?: string;
    decision?: string;
    counts?: { passed: number; failed: number; errors: number; total: number };
  };

  let report: Report | null = null;
  if (existsSync(reportPath)) {
    report = JSON.parse(readFileSync(reportPath, "utf8")) as Report;
  }
  const rawArtifactCount = existsSync(rawDir)
    ? readdirSync(rawDir).filter((f) => !f.startsWith(".")).length
    : 0;
  const counts = report !== null && report.counts !== undefined ? report.counts : null;
  const ready = Boolean(
    counts && counts.failed === 0 && counts.errors === 0 && counts.passed > 0,
  );
  return {
    ready,
    lastValidateAt: report?.generatedAt ?? null,
    validationCounts: counts,
    rawArtifactCount,
  };
}

export function getStackStatus(): {
  ok: boolean;
  service: string;
  mode: string;
  layers: LayerStatusRow[];
  honestyNote: string;
} {
  const l1 = readLayer1Status();

  let l2Ready = false;
  let l2Facts = 0;
  let l2Path = getDefaultSnapshotPath();
  try {
    l2Path = assertSnapshotExists();
    const client = createCanonicalClient(l2Path);
    l2Facts = client.store.getSnapshot().facts.length;
    l2Ready = l2Facts > 0;
  } catch {
    l2Ready = false;
  }

  let l3Ready = false;
  try {
    const rt = createDecisionRuntime(l2Path);
    rt.data.requireTariff({ carrierId: "MAERSK", direction: "export", equipment: "dry" });
    l3Ready = true;
  } catch {
    l3Ready = false;
  }

  let l4Ready = false;
  let laneCount = 0;
  try {
    createLaneRuntime(l2Path);
    laneCount = LANE_CATALOG.length;
    l4Ready = laneCount > 0;
  } catch {
    l4Ready = false;
  }

  let l5Ready = false;
  try {
    const ex = createExplanationRuntime();
    const sample = ex.explanation.explainLane({
      destinationLabel: "stack-check",
      recommendation: "ok",
      winnerLabel: null,
      winnerDemurrageInr: null,
      winnerRisk: null,
      winnerCitation: null,
      saveInrVsRunnerUp: null,
      rankedCount: 0,
      insufficientCount: 0,
      honestyNote: "stack",
    });
    l5Ready = sample.engine === "layer5-template-v1";
  } catch {
    l5Ready = false;
  }

  const layers: LayerStatusRow[] = [
    {
      id: "layer1",
      name: "Ingestion",
      ready: l1.ready,
      detail: l1.validationCounts
        ? `validate ${l1.validationCounts.passed}/${l1.validationCounts.total} · raw ${l1.rawArtifactCount}`
        : "no validate report — run layer1 npm run validate",
      lastAt: l1.lastValidateAt,
    },
    {
      id: "layer2",
      name: "Canonical",
      ready: l2Ready,
      detail: l2Ready ? `${l2Facts} facts · snapshot on disk` : "seed missing",
      lastAt: null,
    },
    {
      id: "layer3",
      name: "Cost + Risk + Estimate",
      ready: l3Ready,
      detail: l3Ready ? "demurrage + risk + estimate-v1" : "cannot price",
      lastAt: null,
    },
    {
      id: "layer4",
      name: "Lanes + Decide",
      ready: l4Ready,
      detail: l4Ready ? `${laneCount} catalog lanes` : "catalog unavailable",
      lastAt: null,
    },
    {
      id: "layer5",
      name: "Explanation",
      ready: l5Ready,
      detail: l5Ready ? "why-these-numbers (template)" : "unavailable",
      lastAt: null,
    },
  ];

  return {
    ok: layers.every((l) => l.ready),
    service: "port-sense",
    mode: "layers",
    layers,
    honestyNote:
      "Waiting fees use verified tariffs. Dwell uses Port Sense estimate (published + congestion buffer). Not live AIS.",
  };
}
