import { nutritionist } from "#/agents/subagents/nutritionist";

const LIST_OF_SUBAGENTS = {
  nutritionist,
};

type AgentChoice = keyof typeof LIST_OF_SUBAGENTS;

export const subAgentSelector = (
  agents?: AgentChoice[],
  all: boolean = false,
) => {
  const allSubAgents = Object.values(LIST_OF_SUBAGENTS);

  if (!agents) {
    if (all) return allSubAgents;
    else return [];
  }
  const choices = agents?.map((agent) => LIST_OF_SUBAGENTS[agent]);
  return choices;
};
