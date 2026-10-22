import { ChatOpenAI } from "@langchain/openai";
import type { SelectedModel } from "#/lib/ai/chat/models";

const modelConfig = {
  maxTokens: 8192,
  temperature: 0.3,
  reasoning: { effort: "low" } as const,
};

const apiKeys: Record<string, string | undefined> = {
  openrouter: process.env.OPENROUTER_API_KEY,
  huggingface: process.env.HF_TOKEN,
  requesty: process.env.REQUESTY_API_KEY,
  ollama: process.env.OLLAMA_API_KEY,
};

export class ChatAIModel extends ChatOpenAI {
  constructor({ providers }: SelectedModel) {
    const { id, inference, endpoint } = providers[0];
    const apiKey = apiKeys[inference];

    super({
      model: id,
      configuration: {
        baseURL: endpoint,
      },
      apiKey,
      ...modelConfig,
    });
  }
}
