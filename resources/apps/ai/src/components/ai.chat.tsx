import { useStreamContext } from "@langchain/react";
import { useEffect, useState } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "#/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "#/components/ai-elements/suggestion";
import { DEFAULT_MODEL, type SelectedModel } from "#/lib/ai/chat/models";
import { MessageList } from "./ai.messages";
import { ModelList } from "./ai.model-list";
import { SUGGESTION_PROMPTS } from "#/agents/basic/prompts";
import type { Agent } from "#/agents/basic/agent";

export function AIChatInterface() {
  const { isLoading, submit, stop, values, error } = useStreamContext<Agent>();
  const [selectedModel, setSelectedModel] =
    useState<SelectedModel>(DEFAULT_MODEL);

  // @ts-expect-error
  const hitlInterrupt = values.__interrupt__?.[0] ?? undefined;

  const isRunning =
    (isLoading && values?.messages?.length > 0) || hitlInterrupt;

  const handleSubmit = (text: string) => {
    if (text.length > 0) {
      submit({
        messages: [
          {
            type: "human",
            content: text,
            ...(selectedModel
              ? {
                  additional_kwargs: {
                    model: selectedModel,
                  },
                }
              : {}),
          },
        ],
      });
    } else void 0;
  };

  useEffect(() => {
    if (!error) return;
    submit({
      messages: [
        {
          type: "ai",
          content: `${error}`,
        },
      ],
    });
    stop();
  }, [error]);

  return (
    <div className="flex flex-1 flex-col h-dvh p-8">
      <MessageList />

      <Suggestions
        className={`w-full justify-center mb-4 ${values?.messages?.length > 0 && "hidden"}`}
      >
        {SUGGESTION_PROMPTS.map((suggestion, index) => (
          <Suggestion
            key={`suggestion-${index}`}
            suggestion={suggestion}
            onClick={handleSubmit}
          />
        ))}
      </Suggestions>
      <div className="shrink-0 p-4 border-t">
        <PromptInput
          onSubmit={({ text }) => handleSubmit(text)}
          className={`w-full max-w-2xl mx-auto ${isRunning && "pointer-events-none"}`}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask me something..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              status={isRunning ? "submitted" : "ready"}
              disabled={isRunning}
            />
            <ModelList onModelSelect={setSelectedModel} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
