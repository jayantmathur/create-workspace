import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatOpenAI } from "@langchain/openai";
import { createDeepAgent, FilesystemBackend } from "deepagents";
import {
  ClearToolUsesEdit,
  contextEditingMiddleware,
  createMiddleware,
  modelCallLimitMiddleware,
  toolCallLimitMiddleware,
  humanInTheLoopMiddleware,
} from "langchain";
import { join } from "path";
import { DEFAULT_MODEL, type SelectedModel } from "#/lib/ai/chat/models";
import { internet_search } from "./tools/internet_search";
import { SYSTEM_PROMPT } from "./prompts";

export const checkpointer = new MemorySaver();
const backend = new FilesystemBackend({
  rootDir:
    process.env.NODE_ENV === "production"
      ? join(process.cwd(), ".output", "agent")
      : import.meta.dirname,
  virtualMode: true,
});

const modelConfig = {
  maxTokens: 4096,
  temperature: 0.3,
  reasoning: { effort: "minimal" as const, summary: "auto" as const },
} as const;

const configurableModel = createMiddleware({
  name: "ConfigurableModel",
  wrapModelCall: async (request: any, handler) => {
    const kwargs = request?.messages?.at(-1).additional_kwargs as
      { model?: SelectedModel } | undefined;
    const model = kwargs?.model;

    if (!model) {
      return handler(request);
    }

    const { provider, value, endpoint } = model;
    const payload = {
      model: value,
      configuration: {
        baseURL: endpoint,
      },
      ...modelConfig,
    };

    switch (provider) {
      case "Openrouter":
        return handler({
          ...request,
          model: new ChatOpenRouter(payload),
        });

      case "Huggingface":
        return handler({
          ...request,
          model: new ChatOpenAI({
            ...payload,
            apiKey: process.env.HF_TOKEN,
          }),
        });

      case "Requesty":
        return handler({
          ...request,
          model: new ChatOpenAI({
            ...payload,
            apiKey: process.env.REQUESTY_API_KEY,
          }),
        });

      case "Ollama":
        return handler({
          ...request,
          model: new ChatOpenAI({
            ...payload,
            apiKey: process.env.OLLAMA_API_KEY,
          }),
        });

      default:
        return handler(request);
    }
  },
});

const defaultModel = new ChatOpenAI({
  // Ollama Cloud model
  model: DEFAULT_MODEL.value,
  apiKey: process.env.OLLAMA_API_KEY,
  configuration: {
    baseURL: DEFAULT_MODEL.endpoint,
  },
  ...modelConfig,
});

export const agent = createDeepAgent({
  model: defaultModel,
  middleware: [
    configurableModel,
    humanInTheLoopMiddleware({
      interruptOn: {
        internet_search: {
          allowedDecisions: ["approve", "reject"],
          description: "Internet search request requires approval to proceed.",
        },
      },
    }),
    modelCallLimitMiddleware({
      threadLimit: 10,
      runLimit: 5,
      exitBehavior: "end",
    }),
    toolCallLimitMiddleware({
      threadLimit: 5,
      runLimit: 3,
    }),
    contextEditingMiddleware({
      edits: [
        new ClearToolUsesEdit({
          triggerTokens: 100000,
          keep: { fraction: 0.3 },
        }),
      ],
    }),
  ],
  systemPrompt: SYSTEM_PROMPT,
  checkpointer: checkpointer,
  tools: [internet_search],
  skills: ["/skills"],
  memory: ["/AGENTS.md"],
  backend: backend,
  permissions: [
    {
      operations: ["write"],
      paths: ["/skills/**"],
      mode: "deny",
    },
  ],
});

export type Agent = typeof agent;
