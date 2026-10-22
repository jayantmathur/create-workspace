import { get_nutrition } from "#/agents/tools/get_nutrition";
import { internet_search } from "#/agents/tools/internet_search";

const LIST_OF_TOOLS = {
  get_nutrition,
  internet_search,
};

type ToolChoice = keyof typeof LIST_OF_TOOLS;

export const toolsSelector = (tools?: ToolChoice[], all: boolean = false) => {
  const allTools = Object.values(LIST_OF_TOOLS);

  if (!tools) {
    if (all) return allTools;
    else return [];
  }
  const choices = tools?.map((tool) => LIST_OF_TOOLS[tool]);
  return choices;
};
