import { getCity, listCities, loadNetwork, ratePerKm, resolveKm } from "../infrastructure/pack.js";
function inrRound(n) {
    return Math.round(n);
}
export class LandedCostService {
    listCities() {
        return listCities();
    }
    quoteRoad(originPortId, originName, size, count, inlandId = "IN_SURAT") {
        const net = loadNetwork();
        const city = getCity(inlandId);
        const { km, highway, basis } = resolveKm(originPortId, inlandId);
        const inrPerKm = ratePerKm(size);
        const roadInr = inrRound(km * inrPerKm * count);
        const tollInr = inrRound(roadInr * (net.tollBufferPct / 100));
        const formula = `${km} km × ₹${inrPerKm}/km × ${count} box + ${net.tollBufferPct}% toll`;
        return {
            originPortId,
            originName,
            inlandId: city.inlandId,
            inlandLabel: city.label,
            km,
            inrPerKm,
            roadInr,
            tollInr,
            truckingInr: roadInr + tollInr,
            rateClass: "SECONDARY_ESTIMATE",
            highway,
            distanceBasis: basis,
            formula,
        };
    }
    totalize(req) {
        const net = loadNetwork();
        const city = getCity(req.inlandId);
        const rows = [];
        for (const origin of req.demurrageByOrigin) {
            const road = this.quoteRoad(origin.originPortId, origin.originName, req.containerSize, req.containerCount, req.inlandId);
            if (origin.status !== "ok") {
                rows.push({
                    originPortId: origin.originPortId,
                    originName: origin.originName,
                    inlandLabel: city.label,
                    demurrageInr: origin.demurrageInr,
                    truckingInr: road.truckingInr,
                    totalInr: Number.POSITIVE_INFINITY,
                    riskLevel: origin.riskLevel,
                    dwellHours: origin.dwellHours,
                    km: road.km,
                    highWait: false,
                    road,
                    status: "insufficient_data",
                    insufficientReason: origin.insufficientReason ?? "Origin demurrage unavailable",
                });
                continue;
            }
            const totalInr = origin.demurrageInr + road.truckingInr;
            rows.push({
                originPortId: origin.originPortId,
                originName: origin.originName,
                inlandLabel: city.label,
                demurrageInr: origin.demurrageInr,
                truckingInr: road.truckingInr,
                totalInr,
                riskLevel: origin.riskLevel,
                dwellHours: origin.dwellHours,
                km: road.km,
                highWait: origin.riskLevel === "high" || origin.demurrageInr > road.truckingInr,
                road,
                status: "ok",
            });
        }
        const ranked = [...rows.filter((r) => r.status === "ok")].sort((a, b) => a.totalInr - b.totalInr || a.km - b.km);
        const winner = ranked[0] ?? null;
        const runnerUp = ranked[1] ?? null;
        const saveInrVsRunnerUp = winner && runnerUp ? runnerUp.totalInr - winner.totalInr : null;
        return {
            inlandId: city.inlandId,
            inlandLabel: city.label,
            containerSize: req.containerSize,
            containerCount: req.containerCount,
            ranked,
            winner,
            saveInrVsRunnerUp,
            oceanFreight: "insufficient",
            honestyNote: net.honestyNote,
            evaluatedAt: new Date().toISOString(),
        };
    }
}
//# sourceMappingURL=landed-cost.service.js.map