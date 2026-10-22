import { useSelector } from "@tanstack/react-store";
import {
  useChatContext,
  store,
  actions,
} from "#/components/ai/stream-provider";
import { cn } from "#/lib/utils";
import { PromptInput } from "#/components/ai/prompt-input";
import { Messages, SuggestionsHero } from "#/components/ai/messages";
import SUGGESTION_PROMPTS from "#/agents/prompts/suggestions.md?raw";

import type { ComponentProps } from "react";

const suggestions = SUGGESTION_PROMPTS.split("\r\n").filter(
  (suggestion) => suggestion.length > 0,
);

export function ChatSession({
  className,
  ...props
}: ComponentProps<"section">) {
  const { messages, sendMessage, error, stop, status, subagents } =
    useChatContext();
  const stops = [stop, ...subagents.flatMap((agent) => agent.stop)];
  const { current } = useSelector(store);
  const { updateThread } = actions;

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    const message = text.trim();

    const title = message.length > 40 ? `${message.slice(0, 40)}…` : message;

    if (current.title === "New chat")
      updateThread(current.id, (current) => ({
        ...current,
        title,
      }));

    sendMessage(message, {});
  };

  const handleStop = () => stops.forEach((stop) => stop?.());

  return (
    <section
      className={cn(
        className,
        "flex flex-col min-h-0 w-full flex-1 p-4 items-center max-w-4xl place-self-center",
      )}
      {...props}
    >
      <Messages />
      <SuggestionsHero
        suggestions={suggestions}
        onSelection={handleSubmit}
        className={messages.length > 0 ? "hidden" : ""}
      />
      {error ? (
        <span className="rounded-md m-8 p-4 bg-destructive/15 text-sm text-destructive">
          {error.message}
        </span>
      ) : null}
      <PromptInput
        className="max-w-lg"
        onSubmit={handleSubmit}
        onStop={handleStop}
        status={status}
      />
    </section>
  );
}
