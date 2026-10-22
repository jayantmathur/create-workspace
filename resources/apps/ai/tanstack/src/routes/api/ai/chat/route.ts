import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  decide,
  subagentRoute,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { typesafeDecider } from "@tanstack/ai-typesafe";
import { memoryPersistence, withPersistence } from "@tanstack/ai-persistence";

import SYSTEM_PROMPT from "#/agents/prompts/system.md?raw";
import { DEFAULT_MODEL } from "#/agents/models";

import { skillsMiddleware } from "#/agents/skills/provider";
import { toolsSelector } from "#/agents/tools/provider";
import { subAgentSelector } from "#/agents/subagents/provider";

import type { SelectableModel, ReasoningEffort } from "#/agents/types";

const persistence = memoryPersistence();

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: { POST },
  },
});

async function POST({ request }: { request: Request }) {
  const params = await chatParamsFromRequest(request);
  const { messages, threadId, runId, parentRunId, resume, forwardedProps } =
    params;
  const { model, reasoning } = forwardedProps as {
    model: SelectableModel;
    reasoning: ReasoningEffort;
  };

  const { providers } = model ?? DEFAULT_MODEL;
  const { id, inference, endpoint } = providers[0];
  const apiKey = {
    openrouter: process.env.OPENROUTER_API_KEY,
    ollama: process.env.OLLAMA_API_KEY,
    huggingface: process.env.HF_TOKEN,
    requesty: process.env.REQUESTY_API_KEY,
  }[inference];

  const adapter = createOpenaiChat(
    // @ts-expect-error Using OpenAI compatible endpoints which don't have the same ids as expected by createOpenAiChat
    id,
    apiKey,
    {
      baseURL: endpoint,
    },
  );

  const stream = chat({
    adapter: adapter,
    messages: messages,
    threadId: threadId,
    runId: runId,
    parentRunId: parentRunId,
    resume: resume,
    systemPrompts: [SYSTEM_PROMPT],
    middleware: [
      withPersistence(persistence),
      skillsMiddleware(["fruit-recommender"]),
    ],
    tools: toolsSelector(["internet_search"]),
    subagents: {
      agents: subAgentSelector(undefined, true),
      // strategy: "handoff",
      router: async ({ messages, agents, abortSignal }) => {
        const state = messages.at(-1);
        if (state === undefined) return "main";

        const route = subagentRoute(agents);
        const result = await decide({
          adapter: typesafeDecider("openjev-latest", {
            baseURL: "https://api.codiv.ai",
          }),
          state,
          questions: route.questions,
          abortSignal,
        });
        const pick = route.pick(result);
        return pick;
      },
    },
    // toolExecution: "sequential",
    retry: { maxRetries: 2, maxWaitMs: 300000 },
    reasoning: { level: reasoning ?? "minimal", summary: true },
  });
  return toServerSentEventsResponse(stream);
}
