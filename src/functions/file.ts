import fs from "node:fs";
import path from "node:path";
import { isObject } from "./isaacScriptCommonTS.js";

/**
 * Helper function to get a "package.json" file as an object. This will throw an error if the
 * "package.json" file cannot be found or is otherwise invalid.
 *
 * @param filePathOrDirPath Either the path to a "package.json" file or the path to a directory
 *                          which contains a "package.json" file.
 */
export function getPackageJSON(
  filePathOrDirPath: string,
): Record<string, unknown> {
  let filePath: string;
  if (isFile(filePathOrDirPath)) {
    filePath = filePathOrDirPath;
  } else if (isDir(filePathOrDirPath)) {
    filePath = path.join(filePathOrDirPath, "package.json");
  } else {
    throw new Error(
      `Failed to find the a "package.json" file at the following path: ${filePathOrDirPath}`,
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Failed to find the a "package.json" file at the following path: ${filePath}`,
    );
  }

  const packageJSON = JSON.parse(filePath) as unknown;
  if (!isObject(packageJSON)) {
    throw new Error(
      `Failed to parse a "package.json" file at the following path: ${filePath}`,
    );
  }

  return packageJSON;
}

/** Helper function to check if the provided path exists and is a directory. */
export function isDir(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

/** Helper function to check if the provided path exists and is a file. */
export function isFile(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

/**
 * Helper function to make a new directory synchronously. Will recursively make as many
 * subdirectories as needed.
 *
 * If the recursive behavior is not desired, then use `fs.mkdirSync` directly.
 */
export function makeDir(dirPath: string): void {
  fs.mkdirSync(dirPath, {
    recursive: true,
  });
}

/**
 * Helper function to read a file synchronously.
 *
 * This assuming that the file is a text file and uses an encoding of "utf8".
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
