import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { SYSTEM_PROMPT } from "./-agent/prompts";
import { DEFAULT_MODEL } from "#/lib/ai/models";
import { getWeather } from "./-agent/tools/get_weather";
import type { SelectableModel, ReasoningEffort } from "#/lib/ai/types";

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: { POST },
  },
});

async function POST({ request }: { request: Request }) {
  const params = await chatParamsFromRequest(request);
  const { messages, threadId, runId, forwardedProps } = params;
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
    // @ts-expect-error
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
    systemPrompts: [SYSTEM_PROMPT],
    // tools: [getWeather],
    // toolExecution: "sequential",
    retry: { maxRetries: 2, maxWaitMs: 300000 },
    reasoning: reasoning ?? "minimal",
  });
  return toServerSentEventsResponse(stream);
}
