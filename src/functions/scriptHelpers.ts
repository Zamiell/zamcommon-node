import { assertDefined, capitalizeFirstLetter } from "isaacscript-common-ts";
import path from "node:path";
import type { Options } from "zx";
import {
  getClosestPackageJSONDir,
  getDirname,
  getElapsedSeconds,
} from "./utils.js";

type ScriptType = "build" | "lint" | "test";

const SCRIPT_TYPE_VERBS = {
  build: "built",
  lint: "linted",
  test: "tested",
} as const satisfies Record<ScriptType, string>;

/** See the documentation for the `script` helper function. */
export async function buildScript(
  $: Options,
  importMetaURL: string,
  func: () => Promise<void>,
): Promise<void> {
  await script($, importMetaURL, func, "build");
}

/** See the documentation for the `script` helper function. */
export async function lintScript(
  $: Options,
  importMetaURL: string,
  func: () => Promise<void>,
): Promise<void> {
  await script($, importMetaURL, func, "lint");
}

/** See the documentation for the `script` helper function. */
export async function testScript(
  $: Options,
  importMetaURL: string,
  func: () => Promise<void>,
): Promise<void> {
  await script($, importMetaURL, func, "test");
}

/**
 * Helper function to create a script for a TypeScript project. You can pass any arbitrary logic you
 * want.
 *
 * This is intended to be used with Google's `zx` library so that you can make a script in the style
 * of a Bash script.
 *
 * @param $ The global variable from `zx`. (This is used to turn verbosity off.)
 * @param importMetaURL Should always be `import.meta.url`. (This is used to find the root directory
 *                      of the package.)
 * @param func The function that contains the build logic for the particular script.
 * @param scriptType Optional. The kind of script. Omit this if you do not want logging.
 */
export async function script(
  $: Options,
  importMetaURL: string,
  func: () => Promise<void>,
  scriptType?: ScriptType,
): Promise<void> {
  $.verbose = false; // eslint-disable-line no-param-reassign

  const args = process.argv.slice(2);
  const quiet = args.includes("quiet");

  const __dirname = getDirname(importMetaURL);
  const packageRoot = getClosestPackageJSONDir(__dirname);
  assertDefined(
    packageRoot,
    'Failed to find the root directory for the package. Does this project have a "package.json" file?',
  );

  const packageName = path.basename(packageRoot);

  if (!quiet && scriptType !== undefined) {
    const capitalizedScriptType = capitalizeFirstLetter(scriptType);
    const verb = `${capitalizedScriptType}ing`;
    console.log(`${verb}: ${packageName}`);
  }

  process.chdir(packageRoot);

  const startTime = Date.now();
  await func();

  if (!quiet && scriptType !== undefined) {
    const verb = SCRIPT_TYPE_VERBS[scriptType];
    const elapsedSeconds = getElapsedSeconds(startTime);
    console.log(
      `Successfully ${verb} ${packageName} in ${elapsedSeconds} seconds.`,
    );
  }
}
