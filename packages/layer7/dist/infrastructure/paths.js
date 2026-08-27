import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
export function getLayer7Root() {
    const here = dirname(fileURLToPath(import.meta.url));
    return join(here, "..", "..");
}
export function readJsonFile(relativeFromPackage) {
    const path = join(getLayer7Root(), relativeFromPackage);
    if (!existsSync(path)) {
        throw new Error(`Layer 7 data missing: ${path}. Run npm run build:data`);
    }
    return JSON.parse(readFileSync(path, "utf8"));
}
//# sourceMappingURL=paths.js.map