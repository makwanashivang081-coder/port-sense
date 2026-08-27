import { LandedCostService } from "../src/index.ts";

let failed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("FAIL", msg);
    failed += 1;
  } else {
    console.log("ok", msg);
  }
}

const svc = new LandedCostService();
const result = svc.totalize({
  inlandId: "IN_SURAT",
  containerSize: "40ft",
  containerCount: 8,
  demurrageByOrigin: [
    {
      originPortId: "INNSA",
      originName: "JNPT",
      demurrageInr: 80000,
      riskLevel: "high",
      dwellHours: 90,
      status: "ok",
    },
    {
      originPortId: "INMUN",
      originName: "Mundra",
      demurrageInr: 20000,
      riskLevel: "medium",
      dwellHours: 50,
      status: "ok",
    },
  ],
});

assert(result.winner?.originPortId === "INMUN" || result.winner != null, "has winner");
assert(result.oceanFreight === "insufficient", "no fake ocean freight");
const mundra = result.ranked.find((r) => r.originPortId === "INMUN");
const jnpt = result.ranked.find((r) => r.originPortId === "INNSA");
assert(Boolean(mundra && jnpt), "both origins");
assert(jnpt!.truckingInr > 0 && mundra!.truckingInr > 0, "road cost present");
assert(jnpt!.km < mundra!.km, "JNPT closer to Surat than Mundra");
assert(jnpt!.highWait, "JNPT flagged high wait / damage");
assert(result.honestyNote.toLowerCase().includes("not a transporter quote"), "honesty");
assert(jnpt!.road.formula.includes("km"), "road formula");

const delhi = svc.totalize({
  inlandId: "IN_DELHI",
  containerSize: "40ft",
  containerCount: 1,
  demurrageByOrigin: [
    {
      originPortId: "INMUN",
      originName: "Mundra",
      demurrageInr: 0,
      riskLevel: "low",
      dwellHours: 40,
      status: "ok",
    },
    {
      originPortId: "INNSA",
      originName: "JNPT",
      demurrageInr: 0,
      riskLevel: "low",
      dwellHours: 40,
      status: "ok",
    },
  ],
});
const dMundra = delhi.ranked.find((r) => r.originPortId === "INMUN");
const dJnpt = delhi.ranked.find((r) => r.originPortId === "INNSA");
assert(Boolean(dMundra && dJnpt), "Delhi origins");
assert(dMundra!.km < dJnpt!.km, "Mundra closer to Delhi than JNPT");
assert(svc.listCities().length >= 6, "city catalog");

if (failed > 0) {
  console.error(`Layer6 validate: ${failed} failed`);
  process.exit(1);
}
console.log("Layer6 validate: READY");
