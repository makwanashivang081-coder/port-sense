import { ExplanationService, AdvisorService } from "../src/index.ts";

const explainer = new ExplanationService();
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL", msg);
    failed += 1;
  } else {
    console.log("ok", msg);
  }
}

const origin = explainer.explainOrigin({
  portName: "JNPT",
  carrierName: "Maersk",
  freeDays: 7,
  dwellDays: 3.2,
  excessDays: 0,
  chargeableDays: 0,
  billedDays: 0,
  totalInr: 0,
  riskLevel: "low",
  riskExplanation: "Inside free time",
  recommendation: "Low exposure at JNPT on this snapshot.",
  tariffFactId: "tariff:MAERSK:export:dry:v1",
  dwellFactId: "dwell_monthly:INNSA:2026-06:v1",
  sourceCitation: "Maersk free time notice",
  honestyNote: "test",
});

assert(origin.engine === "layer5-template-v1", "engine id");
assert(origin.bullets.length >= 4, "origin bullets");
assert(!origin.summary.includes("AIS live"), "no live AIS claim");

const lane = explainer.explainLane({
  destinationLabel: "export→AEJEA",
  recommendation: "Use JNPT → Jebel Ali.",
  winnerLabel: "JNPT → Jebel Ali",
  winnerDemurrageInr: 0,
  winnerRisk: "low",
  winnerCitation: "Maersk",
  saveInrVsRunnerUp: 0,
  rankedCount: 6,
  insufficientCount: 0,
  honestyNote: "test",
});

assert(lane.bullets.some((b) => b.label === "Winner"), "lane winner bullet");

const advisor = new AdvisorService();
const advice = advisor.advise({
  inlandLabel: "Surat",
  asOfDate: "2023-06-08",
  temperatureC: 30.5,
  winnerOrigin: "Mundra",
  saveInrVsRunnerUp: 40000,
  rows: [
    {
      originName: "JNPT",
      demurrageInr: 90000,
      truckingInr: 110000,
      totalInr: 200000,
      highWait: true,
      km: 252,
      riskLevel: "high",
    },
    {
      originName: "Mundra",
      demurrageInr: 20000,
      truckingInr: 160000,
      totalInr: 180000,
      highWait: false,
      km: 372,
      riskLevel: "low",
    },
  ],
  honestyNote: "test",
});
assert(advice.engine === "layer5-advisor-v2", "advisor engine");
assert(advice.spreadsheet.length === 2, "spreadsheet rows");
assert(advice.summary.includes("Mundra"), "names winner");
assert(advice.bullets.some((b) => b.text.toLowerCase().includes("waiting")), "wait language");

if (failed > 0) {
  console.error(`Layer5 validate: ${failed} failed`);
  process.exit(1);
}
console.log("Layer5 validate: READY");
