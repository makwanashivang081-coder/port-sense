import type { CarrierId, PortId, TrustTier } from "./ids.js";
export interface Provenance {
    readonly sourcePath: string;
    readonly publisher: string;
    readonly sourceUrl?: string;
    readonly proofFiles: readonly string[];
    readonly fetchedAt: string;
    readonly verificationStatus: TrustTier;
    readonly note?: string;
}
export interface PortEntity {
    readonly id: PortId;
    readonly name: string;
    readonly aliases: readonly string[];
    readonly isMajorPort: boolean;
    readonly state?: string;
    readonly trustTier: TrustTier;
}
export interface CarrierEntity {
    readonly id: CarrierId;
    readonly name: string;
    readonly aliases: readonly string[];
    readonly trustTier: TrustTier;
}
export declare const PORT_REGISTRY: readonly PortEntity[];
export declare const CARRIER_REGISTRY: readonly CarrierEntity[];
//# sourceMappingURL=entities.d.ts.map