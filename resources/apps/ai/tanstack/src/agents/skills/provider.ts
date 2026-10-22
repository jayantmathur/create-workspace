import { withSkills, filter } from "@tanstack/ai-skills";
import { staticSkills } from "@tanstack/ai-skills/static";
// @ts-expect-error Resolved by the TanStack skills virtual-module plugin.
import { catalog } from "virtual:tanstack-skills";

import fruitRecommender from "./fruit-recommender/SKILL.md?raw";

const LIST_OF_SKILLS = {
  "fruit-recommender": fruitRecommender,
};

type SkillChoice = keyof typeof LIST_OF_SKILLS;

export const skillsMiddleware = (
  skills?: SkillChoice[],
  all: boolean = false,
) => {
  const list = staticSkills(catalog);

  if (!skills) {
    if (all) return withSkills(list);
    else return withSkills([]);
  }

  const filteredSkills = filter(list, (skill) =>
    skills.some((name) => name === skill.name),
  );
  return withSkills(filteredSkills);
};
