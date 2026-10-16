import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useEffect, useState, type ComponentProps } from "react";
import { cn } from "#/lib/utils";
import { PromptInput } from "./ai.prompt-input";
import { Messages, SuggestionsHero } from "./ai.messages";
import { SUGGESTION_PROMPTS } from "#/lib/ai/prompts";
import { DEFAULT_MODEL } from "#/lib/ai/models";
import type { ReasoningEffort, SelectableModel } from "#/lib/ai/types";

export function AIChatInterface({ className }: ComponentProps<"section">) {
  const [model, setModel] = useState<SelectableModel>(DEFAULT_MODEL);
  const [effort, setReasoningEffort] = useState<ReasoningEffort>("minimal");
  const stream = useChat({
    connection: fetchServerSentEvents("/api/ai/chat"),
    forwardedProps: { model, effort },
  });
  const { messages, sendMessage, error, stop, status } = stream;

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text.trim(), {});
  };

  return (
    <section className={cn(className, "flex flex-1 flex-col w-full")}>
      <Messages messages={messages} status={status} />
      <SuggestionsHero
        suggestions={SUGGESTION_PROMPTS}
        onSelection={handleSubmit}
        className={messages.length > 0 ? "hidden" : ""}
      />
      {error ? (
        <span className="rounded-md m-8 p-4 bg-destructive/15 text-sm text-destructive">
          {error.message}
        </span>
      ) : null}
      <PromptInput
        onSubmit={handleSubmit}
        onStop={stop}
        status={status}
        onModelSelection={setModel}
        onReasoningSelection={setReasoningEffort}
      />
    </section>
  );
}
