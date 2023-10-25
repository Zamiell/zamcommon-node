import fs from "node:fs";
import path from "node:path";
import url from "node:url";

/**
 * Helper function to get the path to directory with the closest "package.json" file. This will
 * traverse the directory tree upwards until it finds a match. Returns undefined if a directory
 * could not be found.
 *
 * @param filePath The path to the starting directory from which to begin the search.
 */
export function getClosestPackageJSONDir(filePath: string): string | undefined {
  let currentPath = filePath;
  let lastPath = "";

  while (currentPath !== lastPath) {
    const packageJSONPath = path.join(currentPath, "package.json");

    if (
      fs.existsSync(packageJSONPath) &&
      fs.statSync(packageJSONPath).isFile()
    ) {
      return currentPath;
    }

    lastPath = currentPath;
    currentPath = path.dirname(currentPath);
  }

  return undefined;
}

/**
 * Given a file path, returns the CommonJS equivalent of `__dirname`.
 *
 * @param importMetaURL Should always be `import.meta.url`.
 */
export function getDirname(importMetaURL: string): string {
  return path.dirname(url.fileURLToPath(importMetaURL));
}

/**
 * Helper function to get the number of elapsed seconds since a starting time.
 *
 * This function always returns a whole number (using `Math.floor` on the result).
 *
 * For example:
 *
 * ```ts
 * const startTime = Date.now();
 * doSomething();
 * const elapsedSeconds = getElapsedSeconds(startTime);
 * ```
 */
export function getElapsedSeconds(startTime: number): number {
  const endTime = Date.now();
  const elapsedMilliseconds = endTime - startTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;

  return Math.floor(elapsedSeconds);
}
