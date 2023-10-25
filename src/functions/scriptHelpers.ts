/* eslint-disable sort-exports/sort-exports */

// See: https://github.com/arktypeio/arktype/blob/beta/ark/fs/fs.ts
// Useful functions:
// - dirName
// - findPackageRoot

import { findPackageRoot } from "@arktype/fs";
import { capitalizeFirstLetter } from "isaacscript-common-ts";
import path from "node:path";
import type { Options } from "zx";
import { getElapsedSeconds } from "./time.js";

/** See the documentation for the `script` helper function. */
export async function buildScript(
  $: Options,
  func: (packageRoot: string) => Promise<void> | void,
): Promise<void> {
  await script($, func, "building", "built");
}

/** See the documentation for the `script` helper function. */
export async function lintScript(
  $: Options,
  func: (packageRoot: string) => Promise<void> | void,
): Promise<void> {
  await script($, func, "linting", "linted");
}

/** See the documentation for the `script` helper function. */
export async function testScript(
  $: Options,
  func: (packageRoot: string) => Promise<void> | void,
): Promise<void> {
  await script($, func, "testing", "tested");
}

/**
 * Helper function to create a script for a TypeScript project. You can pass any arbitrary logic you
 * want.
 *
 * This is intended to be used with Google's `zx` library so that you can make a script in the style
 * of a Bash script.
 *
 * Specifically, this helper function will:
 *
 * 1. Turn off verbosity in `zx` (so that the commands will not be echoed).
 * 2. Change the working directory to the package root.
 * 3. Print a script starting message (if a verb was provided and there is not a quiet flag).
 * 4. Run the provided logic.
 * 5. Print a script finishing message with the total amount of seconds taken (if a verb was
 *    provided and there is not a quiet flag).
 *
 * @param $ The global variable from `zx`, which is used to turn verbosity off. The dollar sign will
 *        be present once you add: `import "zx/globals";`
 * @param func The function that contains the build logic for the particular script. This is passed
 *             the path to the package root for convenience. (Before executing the function, the
 *             current working directory will be changed to the package root.)
 * @param beforeVerb Optional. The verb for what the script will be doing. For example, "building".
 * @param afterVerb Optional. The verb for when the script completes. For exampled, "built".
 */
export async function script(
  $: Options,
  func: (packageRoot: string) => Promise<void> | void,
  beforeVerb?: string,
  afterVerb?: string,
): Promise<void> {
  $.verbose = false; // eslint-disable-line no-param-reassign

  const args = new Set(process.argv.slice(2));
  const quiet = args.has("quiet") || args.has("--quiet") || args.has("-q");

  const packageRoot = findPackageRoot();
  const packageName = path.basename(packageRoot);

  if (!quiet && beforeVerb !== undefined) {
    const capitalizedVerb = capitalizeFirstLetter(beforeVerb);
    console.log(`${capitalizedVerb}: ${packageName}`);
  }

  process.chdir(packageRoot);

  const startTime = Date.now();
  await func(packageRoot);

  if (!quiet && afterVerb !== undefined) {
    const elapsedSeconds = getElapsedSeconds(startTime);
    console.log(
      `Successfully ${afterVerb} ${packageName} in ${elapsedSeconds} seconds.`,
    );
  }
}
