import { CALENDAR_MAX, CALENDAR_MIN, createTimeRuntime } from "../src/index.ts";

let failed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("FAIL", msg);
    failed += 1;
  } else {
    console.log("ok", msg);
  }
}

const { clock, live } = createTimeRuntime();

const d1 = clock.resolveDay("2023-06-08");
const d2 = clock.resolveDay("2023-06-09");
const winter = clock.resolveDay("2023-01-01");
const jnpt1 = d1.ports.find((p) => p.portId === "INNSA");
const jnpt2 = d2.ports.find((p) => p.portId === "INNSA");
const jnptW = winter.ports.find((p) => p.portId === "INNSA");
assert(Boolean(jnpt1 && jnpt2 && jnptW), "JNPT readings exist");
assert(jnptW!.temperatureC !== jnpt1!.temperatureC, "temperature changes winter vs June");
assert(
  jnpt1!.temperatureMinC !== jnpt2!.temperatureMinC ||
    jnpt1!.temperatureMaxC !== jnpt2!.temperatureMaxC,
  "consecutive June days still move min/max even if mean matches",
);
assert(jnpt1!.dwellHours !== jnpt2!.dwellHours, "JNPT dwell changes with date");
assert(d1.honestyNote.includes("not live AIS"), "honesty");

const y24 = clock.resolveDay("2024-06-08");
const t23 = jnpt1!.temperatureC;
const t24 = y24.ports.find((p) => p.portId === "INNSA")!.temperatureC;
assert(t23 !== t24, "2023 vs 2024 same month-day temperature differs");

const mundra = d1.ports.find((p) => p.portId === "INMUN");
assert(mundra?.dwellBasis === "scaled_from_jnpt_shape", "Mundra scaled, not fake AIS");

const feed = live.feed({ now: new Date("2026-08-27T08:12:00Z"), asOfDate: "2023-06-08" });
assert(feed.observations.length >= 10, "live observations");
assert(feed.tickMinutes === 10, "10-minute ticks");
assert(feed.clock.asOfDate === "2023-06-08", "feed uses calendar date");

assert(CALENDAR_MIN === "2023-01-01" && CALENDAR_MAX === "2024-12-31", "calendar window");

if (failed > 0) {
  console.error(`Layer7 validate: ${failed} failed`);
  process.exit(1);
}
console.log("Layer7 validate: READY");
