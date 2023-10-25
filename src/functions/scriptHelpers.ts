// See: https://github.com/arktypeio/arktype/blob/beta/ark/fs/fs.ts
// Useful functions:
// - dirName
// - findPackageRoot

import { findPackageRoot } from "@arktype/fs";
import { capitalizeFirstLetter } from "isaacscript-common-ts";
import path from "node:path";
import type { Options } from "zx";
import { getElapsedSeconds } from "./utils.js";

/** See the documentation for the `script` helper function. */
export async function buildScript(
  $: Options,
  func: () => Promise<void> | void,
): Promise<void> {
  await script($, func, "building", "built");
}

/** See the documentation for the `script` helper function. */
export async function lintScript(
  $: Options,
  func: () => Promise<void> | void,
): Promise<void> {
  await script($, func, "linting", "linted");
}

/** See the documentation for the `script` helper function. */
export async function testScript(
  $: Options,
  func: () => Promise<void> | void,
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
 * @param $ The global variable from `zx`. (This is used to turn verbosity off.)
 * @param func The function that contains the build logic for the particular script.
 * @param beforeVerb Optional. The verb for what the script will be doing. For example, "building".
 * @param afterVerb Optional. The verb for when the script completes. For exampled, "built".
 */
export async function script(
  $: Options,
  func: () => Promise<void> | void,
  beforeVerb?: string,
  afterVerb?: string,
): Promise<void> {
  $.verbose = false; // eslint-disable-line no-param-reassign

  const args = process.argv.slice(2);
  const quiet = args.includes("quiet");

  const packageRoot = findPackageRoot();
  const packageName = path.basename(packageRoot);

  if (!quiet && beforeVerb !== undefined) {
    const capitalizedVerb = capitalizeFirstLetter(beforeVerb);
    console.log(`${capitalizedVerb}: ${packageName}`);
  }

  process.chdir(packageRoot);

  const startTime = Date.now();
  await func();

  if (!quiet && afterVerb !== undefined) {
    const elapsedSeconds = getElapsedSeconds(startTime);
    console.log(
      `Successfully ${afterVerb} ${packageName} in ${elapsedSeconds} seconds.`,
    );
  }
}
