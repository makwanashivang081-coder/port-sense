import { readJsonFile } from "../infrastructure/paths.js";
export const TIME_ENGINE_PORTS = [
    "INNSA",
    "INMUN",
    "INMAA",
    "INCOK",
    "INVTZ",
    "INCCU",
    "INDEE",
];
let dailyCache = null;
let monthlyCache = null;
let tempCache = null;
export function loadDaily2023() {
    dailyCache ??= readJsonFile("data/jnpt-daily-2023.json");
    return dailyCache;
}
export function loadMonthlyLdb() {
    monthlyCache ??= readJsonFile("data/jnpt-monthly-ldb.json");
    return monthlyCache;
}
export function loadTemperatures() {
    tempCache ??= readJsonFile("data/port-temperature-2023-2024.json");
    return tempCache;
}
export function publishedExportHoursFallback() {
    // Latest published snapshots used only to scale non-JNPT ports on a 2023 shape.
    return {
        INNSA: 78.6,
        INMUN: 105.2,
        INMAA: 84.0,
        INCOK: 52.0,
        INVTZ: 72.0,
        INCCU: 96.0,
        INDEE: 78.6,
    };
}
//# sourceMappingURL=store.js.map