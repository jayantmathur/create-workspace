import { MemorySaver } from "@langchain/langgraph";
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
import { ChatAIModel } from "#/lib/ai/chat/adapter";
import { internet_search } from "./tools/internet_search";
import { SYSTEM_PROMPT } from "./prompts";

export const checkpointer = new MemorySaver();
const backend = new FilesystemBackend({
  rootDir:
    process.env.NODE_ENV === "production"
      ? join(process.cwd(), ".output", "agents", "basic")
      : import.meta.dirname,
  virtualMode: true,
});

const configurableModel = createMiddleware({
  name: "ConfigurableModel",
  wrapModelCall: async (request: any, handler) => {
    const kwargs = request?.messages?.at(-1).additional_kwargs as
      { model?: SelectedModel } | undefined;
    const model = kwargs?.model;

    if (!model) {
      return handler(request);
    }

    return handler({
      ...request,
      model: new ChatAIModel(model).model,
    });
  },
});

const defaultModel = new ChatAIModel(DEFAULT_MODEL).model;

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
      runLimit: 5,
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
