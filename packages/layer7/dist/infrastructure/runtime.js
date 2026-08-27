import { TimeClockService } from "../application/time-clock.service.js";
import { LiveReplayService } from "../application/live-replay.service.js";
import { IpaVesselService } from "../application/ipa-vessel.service.js";
export function createTimeRuntime() {
    const clock = new TimeClockService();
    return {
        clock,
        live: new LiveReplayService(clock),
        vessels: new IpaVesselService(),
    };
}
//# sourceMappingURL=runtime.js.map