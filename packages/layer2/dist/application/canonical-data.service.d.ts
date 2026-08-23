import type { CanonicalQueryApi, DwellSeriesQuery, TariffQuery } from "../contracts/query.js";
import type { CarrierEntity, PortEntity } from "../domain/entities.js";
import type { DwellMonthlyFact, DwellSnapshotFact, FxFact, TariffFact, TrtFact } from "../domain/facts.js";
import type { CarrierId, PortId } from "../domain/ids.js";
import type { JsonCanonicalStore } from "../infrastructure/json-store.js";
/**
 * Read API for Layer 3+. Never mutates facts — acceptance lives in AcceptanceService.
 */
export declare class CanonicalDataService implements CanonicalQueryApi {
    private readonly store;
    constructor(store: JsonCanonicalStore);
    listPorts(): readonly PortEntity[];
    listCarriers(): readonly CarrierEntity[];
    getPort(id: PortId): PortEntity;
    getCarrier(id: CarrierId): CarrierEntity;
    listTariffs(carrierId?: CarrierId): readonly TariffFact[];
    getTariff(query: TariffQuery): TariffFact | undefined;
    getDwellSeries(query: DwellSeriesQuery): readonly DwellMonthlyFact[];
    getDwellSnapshot(portId: PortId): DwellSnapshotFact | undefined;
    getTrt(portId: PortId): TrtFact | undefined;
    getFx(asOf?: string): FxFact | undefined;
    factCount(): number;
    /**
     * Latest published export port dwell (hours) for a port.
     * Prefer monthly JNPA series; fall back to NLDSL snapshot.
     */
    getLatestExportDwellHours(portId: PortId): {
        hours: number;
        periodKey: string;
        source: "dwell_monthly" | "dwell_snapshot";
        factId: string;
    } | undefined;
    /** Require a tariff or throw — Decision layer should fail closed. */
    requireTariff(query: TariffQuery): TariffFact;
}
//# sourceMappingURL=canonical-data.service.d.ts.map