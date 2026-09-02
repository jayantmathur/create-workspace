import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatOpenAI } from "@langchain/openai";
import { createDeepAgent, FilesystemBackend StateBackend } from "deepagents";
import {
  ClearToolUsesEdit,
  contextEditingMiddleware,
  createMiddleware,
  modelCallLimitMiddleware,
  toolCallLimitMiddleware,
} from "langchain";
import { LIST_OF_MODELS } from "#/lib/ai/chat/models";
import { internet_search } from "./tools/internet_search";
import { SYSTEM_PROMPT } from "./prompts";

export const checkpointer = new MemorySaver();
const backend = new FilesystemBackend({
  rootDir: import.meta.dirname,
  virtualMode: true,
});
// const backend = new StateBackend();

const modelConfig = {
  maxTokens: 4096,
  modelKwargs: {
    reasoning: {
      effort: "low",
    },
  },
};

const configurableModel = createMiddleware({
  name: "ConfigurableModel",
  wrapModelCall: async (request: any, handler) => {
    const kwargs = request?.messages?.at(-1).additional_kwargs as
      | { model?: { provider: string; label: string; value: string } }
      | undefined;
    const model = kwargs?.model;

    if (!model) {
      return handler(request);
    }

    const { provider, value } = model;

    switch (provider) {
      case "Openrouter":
        return handler({
          ...request,
          model: new ChatOpenRouter({
            model: value,
            ...modelConfig,
          }),
        });

      case "Huggingface":
        return handler({
          ...request,
          model: new ChatOpenAI({
            model: value,
            configuration: {
              baseURL: "https://router.huggingface.co/v1",
              apiKey: process.env.HF_TOKEN,
            },
            ...modelConfig,
          }),
        });

      default:
        return handler(request);
    }
  },
});

const defaultModel = new ChatOpenRouter({
  model: LIST_OF_MODELS["Openrouter"][0].value,
  ...modelConfig,
});

export const agent = createDeepAgent({
  model: defaultModel,
  middleware: [
    configurableModel,
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
  interruptOn: {
    internet_search: {
      allowedDecisions: ["approve", "reject"],
    },
  },
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
