import { skillsCatalogPlugin } from "@tanstack/ai-skills/node";

const skillsCatalogId = "\0virtual:tanstack-skills";

export const tanstackSkills = () => [
  skillsCatalogPlugin({ dir: "src/agents/skills" }),
  {
    name: "tanstack-skills-js-compat",
    transform(code: string, id: string) {
      if (id !== skillsCatalogId) return;
      return code.replace(" as const", "");
    },
  },
];

/*

* import { tanstackSkills } from "./vite.tanstack-skills.ts";

const config = defineConfig({
  plugins: [
    ...
*   tanstackSkills(),
  ],
});

*/
