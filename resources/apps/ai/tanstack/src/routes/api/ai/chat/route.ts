import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  decide,
  subagentRoute,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createOpenaiChatCompletions } from "@tanstack/ai-openai";
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

  const {
    metadata: { chefSlug },
    providers,
  } = model ?? DEFAULT_MODEL;
  const { id, inference } = providers[0];

  const endpoint = {
    openrouter: process.env.OPENROUTER_BASE_URL,
    ollama: process.env.OLLAMA_BASE_URL,
    huggingface: process.env.HF_TOKEN,
    requesty: process.env.REQUESTY_BASE_URL,
    groq: process.env.GROQ_BASE_URL,
    cloudflare: process.env.CLOUDFLARE_BASE_URL,
    "microsoft foundry": `${process.env.AZURE_AI_ENDPOINT}/${chefSlug === "anthropic" ? "anthropic" : "openai/v1"}`,
  }[inference];

  const apiKey = {
    openrouter: process.env.OPENROUTER_API_KEY,
    ollama: process.env.OLLAMA_API_KEY,
    huggingface: process.env.HF_TOKEN,
    requesty: process.env.REQUESTY_API_KEY,
    groq: process.env.GROQ_API_KEY,
    cloudflare: process.env.CLOUDFLARE_API_KEY,
    "microsoft foundry": process.env.AZURE_OPENAI_API_KEY,
  }[inference];

  // Use @tanstack/ai-anthropic adapter(s) for anthropic calls
  const adapter = createOpenaiChatCompletions(
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
            baseURL: process.env.TYPESAFE_BASE_URL,
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
    reasoning: {
      level:
        inference === "microsoft foundry" ? "off" : (reasoning ?? "minimal"),
      summary: true,
    },
  });
  return toServerSentEventsResponse(stream);
}
