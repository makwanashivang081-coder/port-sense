import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { StoreNotLoadedError } from "../domain/errors.js";
export class JsonCanonicalStore {
    snapshot = null;
    loadFromFile(path) {
        if (!existsSync(path)) {
            throw new StoreNotLoadedError(`Snapshot missing at ${path}`);
        }
        const raw = readFileSync(path, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed.schemaVersion !== 1) {
            throw new Error(`Unsupported schemaVersion: ${String(parsed.schemaVersion)}`);
        }
        this.snapshot = parsed;
        return parsed;
    }
    loadInMemory(snapshot) {
        this.snapshot = snapshot;
    }
    saveToFile(path, snapshot) {
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
        this.snapshot = snapshot;
    }
    getSnapshot() {
        if (!this.snapshot) {
            throw new StoreNotLoadedError();
        }
        return this.snapshot;
    }
    getPorts() {
        return this.getSnapshot().ports;
    }
    getCarriers() {
        return this.getSnapshot().carriers;
    }
    getFacts() {
        return this.getSnapshot().facts;
    }
    appendFacts(facts) {
        const current = this.getSnapshot();
        const next = {
            ...current,
            generatedAt: new Date().toISOString(),
            facts: [...current.facts, ...facts],
        };
        this.snapshot = next;
        return next;
    }
}
//# sourceMappingURL=json-store.js.map