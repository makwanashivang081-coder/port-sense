import { CanonicalNotFoundError } from "../domain/errors.js";
function pickLatestAsOf(items) {
    if (items.length === 0)
        return undefined;
    return [...items].sort((a, b) => b.asOf.localeCompare(a.asOf))[0];
}
/**
 * Read API for Layer 3+. Never mutates facts — acceptance lives in AcceptanceService.
 */
export class CanonicalDataService {
    store;
    constructor(store) {
        this.store = store;
    }
    listPorts() {
        return this.store.getPorts();
    }
    listCarriers() {
        return this.store.getCarriers();
    }
    getPort(id) {
        const port = this.store.getPorts().find((p) => p.id === id);
        if (!port)
            throw new CanonicalNotFoundError("port", id);
        return port;
    }
    getCarrier(id) {
        const carrier = this.store.getCarriers().find((c) => c.id === id);
        if (!carrier)
            throw new CanonicalNotFoundError("carrier", id);
        return carrier;
    }
    listTariffs(carrierId) {
        return this.store
            .getFacts()
            .filter((f) => f.kind === "tariff")
            .filter((f) => (carrierId ? f.carrierId === carrierId : true));
    }
    getTariff(query) {
        const equipment = query.equipment ?? "dry";
        const matches = this.listTariffs(query.carrierId).filter((f) => f.direction === query.direction && f.equipment === equipment);
        if (query.asOf) {
            const eligible = matches.filter((f) => f.asOf <= query.asOf);
            return pickLatestAsOf(eligible);
        }
        return pickLatestAsOf(matches);
    }
    getDwellSeries(query) {
        return this.store
            .getFacts()
            .filter((f) => f.kind === "dwell_monthly")
            .filter((f) => f.portId === query.portId)
            .filter((f) => query.fromPeriod ? f.periodKey >= query.fromPeriod : true)
            .filter((f) => (query.toPeriod ? f.periodKey <= query.toPeriod : true))
            .sort((a, b) => a.periodKey.localeCompare(b.periodKey));
    }
    getDwellSnapshot(portId) {
        const matches = this.store
            .getFacts()
            .filter((f) => f.kind === "dwell_snapshot")
            .filter((f) => f.portId === portId);
        return pickLatestAsOf(matches);
    }
    getTrt(portId) {
        const matches = this.store
            .getFacts()
            .filter((f) => f.kind === "trt")
            .filter((f) => f.portId === portId);
        return pickLatestAsOf(matches);
    }
    getFx(asOf) {
        const matches = this.store
            .getFacts()
            .filter((f) => f.kind === "fx");
        if (asOf) {
            return pickLatestAsOf(matches.filter((f) => f.asOf <= asOf));
        }
        return pickLatestAsOf(matches);
    }
    factCount() {
        return this.store.getFacts().length;
    }
    /**
     * Latest published export port dwell (hours) for a port.
     * Prefer monthly JNPA series; fall back to NLDSL snapshot.
     */
    getLatestExportDwellHours(portId) {
        const series = this.getDwellSeries({ portId });
        for (let i = series.length - 1; i >= 0; i--) {
            const row = series[i];
            if (row.exportPortHours !== null) {
                return {
                    hours: row.exportPortHours,
                    periodKey: row.periodKey,
                    source: "dwell_monthly",
                    factId: row.factId,
                };
            }
        }
        const snap = this.getDwellSnapshot(portId);
        if (snap?.exportPortHours !== null && snap?.exportPortHours !== undefined) {
            return {
                hours: snap.exportPortHours,
                periodKey: snap.periodLabel,
                source: "dwell_snapshot",
                factId: snap.factId,
            };
        }
        return undefined;
    }
    /** Require a tariff or throw — Decision layer should fail closed. */
    requireTariff(query) {
        const tariff = this.getTariff(query);
        if (!tariff) {
            throw new CanonicalNotFoundError("tariff", `${query.carrierId}/${query.direction}/${query.equipment ?? "dry"}`);
        }
        return tariff;
    }
}
//# sourceMappingURL=canonical-data.service.js.map