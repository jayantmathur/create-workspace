import { ChatOpenAI } from "@langchain/openai";
import type { SelectedModel } from "#/lib/ai/chat/models";

const modelConfig = {
  maxTokens: 4096,
  temperature: 0.3,
  reasoning: { effort: "low", summary: "auto" },
} as const;

export class ChatAIModel extends ChatOpenAI {
  constructor(model: SelectedModel) {
    const { inference, value, endpoint } = model;
      const apiKey = {
        Openrouter: process.env.OPENROUTER_API_KEY,
        Huggingface: process.env.HF_TOKEN,
        Requesty: process.env.REQUESTY_API_KEY,
        Ollama: process.env.OLLAMA_API_KEY,
      }[inference];

    super({
      model: value,
        configuration: {
          baseURL: endpoint,
        },
        apiKey,
        ...modelConfig,
      });
  }
}
