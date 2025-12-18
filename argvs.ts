#!/usr/bin/env bun

import { file, argv, $ } from "bun";
import { parseArgs } from "util";
import { basename, resolve } from "node:path";
import color from "picocolors";

import { editJson, runPadd, syncRepositories } from "./utils";
import type { BumpType, PaddType } from "./utils/types";
import list from "./resources/list.json" assert { type: "json" };
import { version } from "./package.json" assert { type: "json" };

//
// Constants
//

const {
  bold: BOLD,
  italic: ITALIC,
  underline: UNDERLINE,
  dim: DIM,
  strikethrough: STRIKE,
} = color;

const __cwd = process.cwd();

const listOfPadds: {
  [key: string]: Omit<PaddType, "name">;
} = list as any;

//
// Main function
//

async function main() {
  const { values: flags, positionals } = parseArgs({
    args: argv,
    options: {
      restore: {
        type: "boolean",
        default: false,
      },
      version: {
        type: "string",
        short: "v",
        default: undefined,
      },
      project: {
        type: "string",
        short: "p",
        default: undefined,
      },
      pack: {
        type: "string",
        short: "k",
        default: undefined,
        multiple: true,
      },
    },
    allowPositionals: true,
    allowNegatives: true,
  });

  const { version: bump, restore } = flags;

  positionals.length < 3 && process.exit(0);

  positionals.slice(2).length > 1 &&
    console.error(
      BOLD("Error") +
        `: Expected 1 command, got ${positionals.slice(2).length}. Please provide only one command.`,
    ) &&
    process.exit(1);

  const command = positionals.slice(2)[0];

  switch (command) {
    case "padd":
      const { project, pack: packs } = flags;

      if (!project || !packs) {
        console.error(BOLD("Error") + ": Missing required flags.");
        process.exit(1);
      }
      for (const pack of packs) {
        const packData = listOfPadds[pack] as PaddType;

        if (!listOfPadds[pack] || !packData) {
          console.error(BOLD("Error") + `: Package ${pack} not found.`);
          process.exit(1);
        }

        const checkProjectPath = await file(
          resolve(__cwd, `${packData.type}s`, project, "package.json"),
        ).exists();

        if (!checkProjectPath) {
          console.error(BOLD("Error") + `: Project ${project} does not exist.`);
          process.exit(1);
        }

        await runPadd(project, packData).finally(() =>
          console.log(`Package add process finished.`),
        );
      }

      break;
    case "sync":
      async function confirmSyncPaths() {
        const backupFile = file(resolve(__cwd, ".backup"));
        const backupPath =
          backupFile.size > 0 ? await backupFile.text() : undefined;

        if (!backupPath) {
          console.error(BOLD("Error") + `: Sync failed. No destination found.`);
          process.exit(1);
        }

        const type = restore ? "restore" : "backup";
        const src = restore ? resolve(backupPath, basename(__cwd)) : __cwd;
        const dest = restore ? __cwd : resolve(backupPath, basename(__cwd));

        return { type, src, dest } as {
          type: "backup" | "restore";
          src: string;
          dest: string;
        };
      }

      const syncPaths = await confirmSyncPaths();

      const { added, updated, deleted } = await syncRepositories(
        syncPaths.type,
        syncPaths.src,
        syncPaths.dest,
      );

      if (added === 0 && updated === 0 && deleted === 0) {
        console.log(
          DIM(`Workspace repositories are synced. No changes performed.`),
        );
        break;
      }

      console.log(
        color.greenBright(
          `${BOLD("Success")}: Sync ${UNDERLINE(syncPaths.type)} completed.`,
        ),
      );
      console.log(DIM("Summary of file changes:"));
      console.table({
        Added: added,
        Updated: updated,
        Deleted: deleted,
      });

      break;
    case "git":
      if (restore) break;

      await $`git add -A`.cwd(__cwd).quiet();

      const statusResult = await $`git status --porcelain`.cwd(__cwd).quiet();
      const status = String(statusResult.stdout ?? "").trim();

      // only commit if there are changes
      if (!status) {
        console.log("No changes to commit.");
        break;
      } else {
        await $`git commit -m "chore(update)"`.cwd(__cwd).quiet();
        console.log("Found changes. Committed.");
      }

      if (bump) {
        const newVersion = bumpVersion(version, bump as BumpType);
        await editJson(resolve(__cwd, "package.json"), { version: newVersion });
        console.log(`Updated version: ${version} -> ${newVersion}.`);

        await $`git tag v${newVersion}`.cwd(__cwd).quiet();
        console.log(`Created tag v${newVersion}.`);
      }

      // push current HEAD to origin main (or configured branch)
      await $`git push origin HEAD:main`.cwd(__cwd).quiet();

      if (bump) await $`git push origin --tags`.cwd(__cwd).quiet();

      console.log(`Pushed to origin/main.`);

      break;
    default:
      console.error(`Unknown command: ${command}`);
  }
}

//
// Run the main function and close cleanly
//

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

//
// Helpers
//

function bumpVersion(
  current: string,
  bump: "patch" | "minor" | "major",
): string {
  const parts = current.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN))
    throw new Error(`Invalid version: ${current}`);
  let [major = 0, minor = 0, patch = 0] = parts;

  switch (bump) {
    case "major":
      major++;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor++;
      patch = 0;
      break;
    default:
      patch++;
  }

  return `${major}.${minor}.${patch}`;
}
