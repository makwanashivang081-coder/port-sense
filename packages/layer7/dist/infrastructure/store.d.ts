import type { PortId } from "@port-sense/layer2-canonical";
import type { DailyDwellRow, TemperaturePoint } from "../domain/types.js";
export declare const TIME_ENGINE_PORTS: readonly PortId[];
interface DailyFile {
    portId: string;
    source: string;
    yearMeanHours: number;
    days: DailyDwellRow[];
}
interface MonthlyFile {
    months: Array<{
        periodKey: string;
        exportDwellHours: number;
        importDwellHours: number;
        source: string;
    }>;
}
interface TempFile {
    source: string;
    sourceUrl: string;
    ports: Record<string, TemperaturePoint[]>;
}
export declare function loadDaily2023(): DailyFile;
export declare function loadMonthlyLdb(): MonthlyFile;
export declare function loadTemperatures(): TempFile;
export declare function publishedExportHoursFallback(): Readonly<Record<PortId, number>>;
export {};
//# sourceMappingURL=store.d.ts.map