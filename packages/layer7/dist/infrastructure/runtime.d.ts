import { TimeClockService } from "../application/time-clock.service.js";
import { LiveReplayService } from "../application/live-replay.service.js";
import { IpaVesselService } from "../application/ipa-vessel.service.js";
export interface TimeRuntime {
    readonly clock: TimeClockService;
    readonly live: LiveReplayService;
    readonly vessels: IpaVesselService;
}
export declare function createTimeRuntime(): TimeRuntime;
//# sourceMappingURL=runtime.d.ts.map