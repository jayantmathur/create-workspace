import { createOpenaiChat } from "@tanstack/ai-openai";
import { DEFAULT_MODEL, LIST_OF_MODELS } from "#/agents/models";
import { store } from "#/components/ai/stream-provider";

export function getAgent(chefSlug?: string) {
  const { model: current } = store.get();
  const model = LIST_OF_MODELS.find(
    ({ metadata }) => metadata.chefSlug === chefSlug,
  );
  const { providers } = model ?? current ?? DEFAULT_MODEL;
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

  return adapter;
}
