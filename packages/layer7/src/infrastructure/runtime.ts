import { TimeClockService } from "../application/time-clock.service.js";
import { LiveReplayService } from "../application/live-replay.service.js";

export interface TimeRuntime {
  readonly clock: TimeClockService;
  readonly live: LiveReplayService;
}

export function createTimeRuntime(): TimeRuntime {
  const clock = new TimeClockService();
  return { clock, live: new LiveReplayService(clock) };
}
