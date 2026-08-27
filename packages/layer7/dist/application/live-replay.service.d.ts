import type { PortId } from "@port-sense/layer2-canonical";
import { type LiveFeed } from "../domain/types.js";
import { TimeClockService } from "./time-clock.service.js";
/**
 * Map wall-clock "now" onto a 2023 calendar day when the caller did not pick a date.
 * Uses day-of-year so the live page still moves as real time passes.
 */
export declare function defaultReplayDate(now?: Date): string;
export declare class LiveReplayService {
    private readonly clock;
    constructor(clock: TimeClockService);
    feed(options?: {
        now?: Date;
        asOfDate?: string;
        portId?: PortId;
        maxObservations?: number;
    }): LiveFeed;
}
//# sourceMappingURL=live-replay.service.d.ts.map