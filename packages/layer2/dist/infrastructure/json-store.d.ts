import type { CanonicalSnapshot, CanonicalFact } from "../domain/facts.js";
import type { CarrierEntity, PortEntity } from "../domain/entities.js";
export declare class JsonCanonicalStore {
    private snapshot;
    loadFromFile(path: string): CanonicalSnapshot;
    loadInMemory(snapshot: CanonicalSnapshot): void;
    saveToFile(path: string, snapshot: CanonicalSnapshot): void;
    getSnapshot(): CanonicalSnapshot;
    getPorts(): readonly PortEntity[];
    getCarriers(): readonly CarrierEntity[];
    getFacts(): readonly CanonicalFact[];
    appendFacts(facts: readonly CanonicalFact[]): CanonicalSnapshot;
}
//# sourceMappingURL=json-store.d.ts.map