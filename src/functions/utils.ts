import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Given a file path, return the CommonJS equivalent of `__dirname`.
 *
 * @param importMetaUrl Should always be `import.meta.url`.
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}
