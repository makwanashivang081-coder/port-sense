import { TimeClockService } from "../application/time-clock.service.js";
import { LiveReplayService } from "../application/live-replay.service.js";
export function createTimeRuntime() {
    const clock = new TimeClockService();
    return { clock, live: new LiveReplayService(clock) };
}
//# sourceMappingURL=runtime.js.map