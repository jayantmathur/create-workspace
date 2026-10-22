import { chat, defineAgent } from "@tanstack/ai";
import { linkAbort } from "#/agents/subagents/link-abort";
// import { skillsMiddleware } from "#/agents/skills/provider";
import { toolsSelector } from "#/agents/tools/provider";

import SYSTEM_PROMPT from "./prompts/system.md?raw";
import { getAgent } from "#/agents/agent";

export const nutritionist = defineAgent({
  name: "nutritionist",
  description:
    "Does this turn need information on food nutrition? Answer yes only when the user asks for health or nutrition data. Answer no otherwise",
  run: (ctx) =>
    chat({
      adapter: getAgent(),
      messages: ctx.messages,
      threadId: ctx.threadId,
      runId: ctx.runId,
      parentRunId: ctx.parentRunId,
      subagentRunId: ctx.subagentRunId,
      resume: ctx.resume,
      abortController: linkAbort(ctx.abortSignal),
      systemPrompts: [SYSTEM_PROMPT],
      // middleware: [skillsMiddleware()],
      tools: toolsSelector(["get_nutrition"]),
    }),
});
