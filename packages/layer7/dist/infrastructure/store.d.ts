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
interface IpaFile {
    source: string;
    sourceUrl: string;
    kind: string;
    fetchedAt: string;
    file?: string;
    files?: string[];
    notAis: boolean;
    notDwellHours: boolean;
    notDemurrage: boolean;
    dates: string[];
    latestDate: string;
    unpublishedAugust?: string[];
    missingProductPorts: Array<{
        portId: PortId;
        uiPortId: string;
        reason: string;
    }>;
    honestyNote: string;
    rows: Array<{
        date: string;
        ipaName: string;
        portId: PortId | null;
        uiPortId: string | null;
        inProduct: boolean;
        atBerth: number | null;
        atAnchorage: number | null;
        remark: string | null;
        sourceFile: string | null;
        note: string;
    }>;
    traffic?: Array<{
        ipaName: string;
        period: "apr-jul";
        tonnes2026k: number;
        tonnes2025k: number;
        variationPct: number;
    }>;
}
export declare function loadDaily2023(): DailyFile;
export declare function loadMonthlyLdb(): MonthlyFile;
export declare function loadTemperatures(): TempFile;
export declare function loadIpaVessels(): IpaFile;
export declare function publishedExportHoursFallback(): Readonly<Record<PortId, number>>;
export {};
//# sourceMappingURL=store.d.ts.map