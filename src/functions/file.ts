import fs from "node:fs";

/** Helper function to check if the provided path exists and is a directory. */
export function isDir(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

/** Helper function to check if the provided path exists and is a file. */
export function isFile(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}
