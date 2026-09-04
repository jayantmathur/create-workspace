import {
  HttpAgentServerAdapter,
  StreamProvider,
  useStreamContext,
} from "@langchain/react";
import { SparklesIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "#/components/ui/combobox";
import { InputGroupAddon } from "#/components/ui/input-group";
import { LIST_OF_MODELS } from "#/lib/ai/chat/models";
import {
  createThread,
  deleteThread,
  fetchThreads,
  getApiUrl,
  type ThreadSummary,
} from "#/lib/ai/chat/threads-client";
import { MessageList } from "./ai.messages";
import { ThreadHistory } from "./ai.thread-history";
import { HITLCard } from "./ai.hitl-card";

import type { Agent } from "#/agents/basic/agent";

type SelectedModel = {
  provider: string;
  label: string;
  value: string;
};

const modelsList = Object.keys(LIST_OF_MODELS).map((key) => ({
  value: key,
  items: LIST_OF_MODELS[key],
}));

const promptSuggestions = [
  "What can you do?",
  "What is the difference between apples and oranges?",
  "I want to try a new fruit.",
];

export function AIChat() {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  // Guards the one-time init against React Strict Mode's double-invoke in dev,
  // which would otherwise create two threads when none exist yet.
  const initStarted = useRef(false);

  const refreshThreads = useCallback(async () => {
    setThreads(await fetchThreads());
  }, []);

  // On mount, load threads from the server (single source of truth). If none
  // exist yet, create one. All setState happens in an async callback, so the
  // effect body never calls setState synchronously.
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;
    void (async () => {
      const list = await fetchThreads();
      if (list.length > 0) {
        setThreads(list);
        setThreadId(list[0].id);
      } else {
        const id = await createThread();
        setThreads(await fetchThreads());
        setThreadId(id);
      }
      setMounted(true);
    })();
  }, []);

  const transport = useMemo(() => {
    if (!threadId) return null;
    return new HttpAgentServerAdapter({
      apiUrl: getApiUrl(),
      threadId,
      paths: {
        commands: `/threads/${threadId}/commands`,
        stream: `/threads/${threadId}/stream`,
        state: `/threads/${threadId}/state`,
      },
    });
  }, [threadId]);

  const handleSelect = useCallback(
    (id: string) => {
      if (id !== threadId) setThreadId(id);
    },
    [threadId],
  );

  const handleCreate = useCallback(async () => {
    const id = await createThread();
    await refreshThreads();
    setThreadId(id);
  }, [refreshThreads]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteThread(id);
      const list = await fetchThreads();
      setThreads(list);
      if (id !== threadId) return;
      if (list.length > 0) {
        setThreadId(list[0].id);
      } else {
        const freshId = await createThread();
        setThreads(await fetchThreads());
        setThreadId(freshId);
      }
    },
    [threadId],
  );

  if (!mounted || !threadId || !transport) {
    return (
      <div className="grid place-content-center w-full h-dvh">
        <strong>Preparing chat…</strong>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <ThreadHistory
        activeThreadId={threadId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onSelect={handleSelect}
        threads={threads}
      />
      <StreamProvider key={threadId} threadId={threadId} transport={transport}>
        <ChatComponent />
      </StreamProvider>
    </div>
  );
}

function ChatComponent() {
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>({
    provider: "Openrouter",
    ...LIST_OF_MODELS["Openrouter"][0],
  });
  const stream = useStreamContext<Agent>();
  const { isLoading, submit, stop, values } = stream;
  const interrupted = values?.__interrupt__ ?? undefined;

  const handleSubmit = (text: string) =>
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
    }).then(() => setSelectedModel(null));

  return (
    <div className="flex flex-1 flex-col h-dvh p-8">
      <MessageList />

      <Suggestions
        className={`w-full justify-center mb-4 ${values?.messages?.length > 0 && "hidden"}`}
      >
        {promptSuggestions.map((suggestion, index) => (
          <Suggestion
            key={`suggestion-${index}`}
            suggestion={suggestion}
            onClick={handleSubmit}
          />
        ))}
      </Suggestions>
      <div className="shrink-0 p-4 border-t">
        <HITLCard
          className={`w-full max-w-2xl mx-auto ${!interrupted && "hidden"}`}
        />
        <PromptInput
          onSubmit={({ text }) => (isLoading ? stop() : handleSubmit(text))}
          className={`w-full max-w-2xl mx-auto ${interrupted && "hidden"}`}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask me something..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit status={(isLoading && "streaming") || "ready"} />
            <Combobox
              items={modelsList}
              autoHighlight
              onValueChange={(item) => setSelectedModel(item as SelectedModel)}
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
                  {(group, index) => (
                    <ComboboxGroup key={group.value} items={group.items}>
                      <ComboboxLabel>{group.value}</ComboboxLabel>
                      <ComboboxCollection>
                        {(item) => (
                          <ComboboxItem
                            key={item.value}
                            value={{ provider: group.value, ...item }}
                          >
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                      {index < modelsList.length - 1 && <ComboboxSeparator />}
                    </ComboboxGroup>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
