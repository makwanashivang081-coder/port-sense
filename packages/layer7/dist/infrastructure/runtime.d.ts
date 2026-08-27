import { TimeClockService } from "../application/time-clock.service.js";
import { LiveReplayService } from "../application/live-replay.service.js";
export interface TimeRuntime {
    readonly clock: TimeClockService;
    readonly live: LiveReplayService;
}
export declare function createTimeRuntime(): TimeRuntime;
//# sourceMappingURL=runtime.d.ts.map