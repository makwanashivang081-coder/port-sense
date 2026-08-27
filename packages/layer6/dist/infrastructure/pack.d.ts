import type { PortId } from "@port-sense/layer2-canonical";
import type { ContainerSize } from "@port-sense/layer3-decision";
import type { DistanceBasis, InlandCity, InlandId } from "../domain/types.js";
interface PortRow {
    id: PortId;
    name: string;
    lat: number;
    lng: number;
}
interface CityRow extends InlandCity {
    corridors: Array<{
        originPortId: PortId;
        km: number;
        highway: string;
    }>;
}
interface Network {
    honestyNote: string;
    rateClass: "SECONDARY_ESTIMATE";
    rateInrPerKm: Record<string, number>;
    tollBufferPct: number;
    highwayWinding: number;
    ports: PortRow[];
    cities: CityRow[];
}
export declare function loadNetwork(): Network;
export declare function listCities(): InlandCity[];
export declare function getCity(inlandId: InlandId): CityRow;
export declare function ratePerKm(size: ContainerSize): number;
export declare function resolveKm(originPortId: PortId, inlandId: InlandId): {
    km: number;
    highway: string;
    basis: DistanceBasis;
};
export {};
//# sourceMappingURL=pack.d.ts.map