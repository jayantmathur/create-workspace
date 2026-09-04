import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

export function copyAgentResources(): Plugin {
  return {
    name: "copy-agent-resources",
    apply: "build",
    async closeBundle() {
      const sourceDir = resolve(__dirname, "src/agents/basic");
      const destDir = resolve(__dirname, ".output/agent");

      await Promise.all([
        cp(resolve(sourceDir, "AGENTS.md"), resolve(destDir, "AGENTS.md"), {
          force: true,
        }),
        cp(resolve(sourceDir, "skills"), resolve(destDir, "skills"), {
          recursive: true,
          force: true,
        }),
      ]);

      console.log(`Copied agent resources from ${sourceDir} to ${destDir}`);
    },
  };
}
