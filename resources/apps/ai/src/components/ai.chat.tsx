import { useStreamContext } from "@langchain/react";
import { SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "#/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "#/components/ai-elements/suggestion";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "#/components/ui/item";
import { InputGroupAddon } from "#/components/ui/input-group";
import {
  DEFAULT_MODEL,
  LIST_OF_MODELS,
  type SelectedModel,
} from "#/lib/ai/chat/models";
import { MessageList } from "./ai.messages";
import { HITLCard } from "./ai.hitl-card";

import { SUGGESTION_PROMPTS } from "#/agents/basic/prompts";
import type { Agent } from "#/agents/basic/agent";

export function AIChatInterface() {
  const { isLoading, submit, stop, values, error } = useStreamContext<Agent>();
  const [selectedModel, setSelectedModel] =
    useState<SelectedModel>(DEFAULT_MODEL);

  const hitlInterrupt = values.__interrupt__?.[0] ?? undefined;

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
        <HITLCard
          interrupt={hitlInterrupt}
          className={`w-full max-w-2xl mx-auto ${!hitlInterrupt && "hidden"}`}
        />
        <PromptInput
          onSubmit={({ text }) => handleSubmit(text)}
          className={`w-full max-w-2xl mx-auto ${hitlInterrupt && "hidden"}`}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask me something..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              status={
                isLoading && values?.messages?.length > 0
                  ? "submitted"
                  : "ready"
              }
              disabled={isLoading && values?.messages?.length > 0}
            />
            <Combobox
              items={LIST_OF_MODELS}
              autoHighlight
              onValueChange={(value: SelectedModel | null) =>
                value && setSelectedModel(value)
              }
            >
              <ComboboxInput
                className="min-w-2/5"
                placeholder="Select an AI model provider"
                showClear
              >
                <InputGroupAddon>
                  <SparklesIcon />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent>
                <ComboboxEmpty>No models found.</ComboboxEmpty>
                <ComboboxList>
                  {(model: SelectedModel) => {
                    const { label, value, provider } = model;
                    return (
                      <ComboboxItem
                        key={`${provider}-${label}/${value}`.toLowerCase()}
                        value={model}
                      >
                        <Item className="p-0">
                          <ItemContent>
                            <ItemTitle className="whitespace-nowrap">
                              {label}
                            </ItemTitle>
                            <ItemDescription className="text-xs">
                              {provider}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      </ComboboxItem>
                    );
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
