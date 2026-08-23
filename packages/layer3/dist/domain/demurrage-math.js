export function hoursToDays(hours) {
    return hours / 24;
}
export function sizeRate(slab, size) {
    if (size === "20ft")
        return slab.rate20PerDay;
    // 40hc uses 40 rate from published slabs (carriers print 40/40HC together)
    return slab.rate40PerDay;
}
/** Assign absolute day bounds when seed omitted dayFrom/dayTo. */
export function normalizeSlabs(freeDays, slabs) {
    let cursor = freeDays + 1;
    return slabs.map((s) => {
        if (s.dayFrom !== undefined) {
            const dayTo = s.dayTo === undefined ? null : s.dayTo;
            if (typeof dayTo === "number")
                cursor = dayTo + 1;
            else
                cursor = (s.dayFrom ?? cursor) + 1;
            return { ...s, dayFrom: s.dayFrom, dayTo };
        }
        const parsed = parseRangeLabel(s.label);
        if (parsed) {
            cursor = parsed.dayTo === null ? parsed.dayFrom + 1 : parsed.dayTo + 1;
            return { ...s, dayFrom: parsed.dayFrom, dayTo: parsed.dayTo };
        }
        const dayFrom = cursor;
        const dayTo = cursor;
        cursor += 1;
        return { ...s, dayFrom, dayTo };
    });
}
function parseRangeLabel(label) {
    const range = /(\d+)\s*(?:to|-|–)\s*(\d+)/i.exec(label);
    if (range?.[1] && range[2]) {
        return { dayFrom: Number(range[1]), dayTo: Number(range[2]) };
    }
    const onwards = /(\d+)\s*(?:and above|onwards|th day onwards|\+)/i.exec(label);
    if (onwards?.[1]) {
        return { dayFrom: Number(onwards[1]), dayTo: null };
    }
    return null;
}
export function rateForDetentionDay(tariff, detentionDay, size) {
    const slabs = normalizeSlabs(tariff.freeDays, tariff.slabs);
    for (const s of slabs) {
        if (detentionDay >= s.dayFrom &&
            (s.dayTo === null || detentionDay <= s.dayTo)) {
            return { rate: sizeRate(s, size), label: s.label };
        }
    }
    const last = slabs[slabs.length - 1];
    if (!last)
        return { rate: 0, label: "none" };
    return { rate: sizeRate(last, size), label: last.label };
}
export function buildDayCharges(params) {
    const { tariff, billedDays, size, fxInrPerUsd } = params;
    const days = [];
    let totalInr = 0;
    const start = tariff.freeDays + 1;
    for (let i = 0; i < billedDays; i++) {
        const detentionDay = start + i;
        const { rate, label } = rateForDetentionDay(tariff, detentionDay, size);
        let rateInr = rate;
        if (tariff.currency === "USD") {
            if (fxInrPerUsd === null || !Number.isFinite(fxInrPerUsd)) {
                throw new Error("USD tariff requires FX fact from Layer 2");
            }
            rateInr = rate * fxInrPerUsd;
        }
        days.push({
            dayIndex: detentionDay,
            rateInrPerDay: Math.round(rateInr * 100) / 100,
            currencyOriginal: tariff.currency,
            slabLabel: label,
        });
        totalInr += rateInr;
    }
    return {
        days,
        currencyOriginal: tariff.currency,
        totalInr: Math.round(totalInr),
    };
}
export function riskScoreFromExcess(excessDays) {
    // excessDays = dwellDays - freeDays (can be negative → low)
    if (excessDays <= 0)
        return { score: 20, level: "low" };
    if (excessDays < 3)
        return { score: 45, level: "medium" };
    if (excessDays < 7)
        return { score: 70, level: "high" };
    return { score: 90, level: "high" };
}
//# sourceMappingURL=demurrage-math.js.map