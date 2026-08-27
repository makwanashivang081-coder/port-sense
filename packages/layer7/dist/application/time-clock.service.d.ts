import type { PortId } from "@port-sense/layer2-canonical";
import { type ClockSnapshot } from "../domain/types.js";
export declare function clampCalendarDate(raw: string): string;
export declare function analog2023Date(asOfDate: string): string;
export declare class TimeClockService {
    resolveDay(rawDate: string): ClockSnapshot;
    dwellHoursFor(portId: PortId, rawDate: string): number;
    dwellByPort(rawDate: string): Partial<Record<PortId, number>>;
    temperatureC(portId: PortId, rawDate: string): number;
}
//# sourceMappingURL=time-clock.service.d.ts.map