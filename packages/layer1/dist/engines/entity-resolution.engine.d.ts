export type ResolvedPortId = "INNSA" | "INMUN" | "INMAA" | "INCOK" | "INVTZ" | "INCCU" | "INDEE" | "INPAV";
export interface PortResolution {
    readonly canonicalPortId: ResolvedPortId | null;
    readonly confidence: number;
    readonly matchedAlias: string | null;
}
/**
 * Entity Resolution Engine — many surface names → one canonical port id.
 */
export declare class EntityResolutionEngine {
    resolvePort(name: string): PortResolution;
    /** Test helper: all names must resolve to the same id. */
    allResolveToSame(names: readonly string[]): {
        ok: boolean;
        id: ResolvedPortId | null;
    };
}
//# sourceMappingURL=entity-resolution.engine.d.ts.map