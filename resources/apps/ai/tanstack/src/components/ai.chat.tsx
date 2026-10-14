import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { Suggestion, Suggestions } from "#/components/ai-elements/suggestion";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "#/components/ai-elements/prompt-input";
import { Messages } from "./ai.messages";
import { ModelList } from "./ai.model-list";

const SUGGESTION_PROMPTS = [
  "What can you do?",
  "What is the difference between apples and oranges?",
  "I want to try a new fruit.",
];

export function AIChatInterface() {
  const {
    messages,
    sendMessage,
    isLoading: isStreaming,
    error,
    stop,
  } = useChat({
    connection: fetchServerSentEvents("/api/ai/chat"),
  });

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text.trim());
  };

  return (
    <section className="flex flex-1 flex-col h-dvh p-8">
      <Messages messages={messages} isStreaming={isStreaming} />
      <Suggestions
        hidden={messages.length > 0}
        className="w-full justify-center mb-4"
      >
        {SUGGESTION_PROMPTS.map((suggestion, index) => (
          <Suggestion
            key={`suggestion-${index}`}
            suggestion={suggestion}
            onPointerDown={() => handleSubmit(suggestion)}
          />
        ))}
      </Suggestions>
      {error ? <p>{error.message}</p> : null}
      <div className="shrink-0 p-4 border-t">
        <PromptInputProvider>
          <PromptInput
            globalDrop
            multiple
            onSubmit={({ text }) => handleSubmit(text)}
          >
            <PromptInputBody>
              <PromptInputTextarea />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit
                status={isStreaming ? "streaming" : "ready"}
                // disabled={isStreaming}
                onPointerDown={isStreaming ? stop : undefined}
              />
              <PromptInputTools>
                <ModelList onModelSelect={() => void 0} />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </section>
  );
}
