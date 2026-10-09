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

import { SUGGESTION_PROMPTS } from "#/agents/basic/prompts";
import type { Agent } from "#/agents/basic/agent";

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
  const [selectedModel, setSelectedModel] =
    useState<SelectedModel>(DEFAULT_MODEL);
  const stream = useStreamContext<Agent>();
  const { isLoading, submit, stop, values, error } = stream;
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
    });

  const handleError = useCallback(
    (error: unknown) =>
      submit({
        messages: [
          {
            type: "ai",
            content: `${error}`,
          },
        ],
      }),
    [],
  );

  useEffect(() => {
    if (error) {
      handleError(error);
      stop();
    }
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
          className={`w-full max-w-2xl mx-auto ${!interrupted && "hidden"}`}
        />
        <PromptInput
          onSubmit={({ text }) =>
            text.length > 0 ? handleSubmit(text) : void 0
          }
          className={`w-full max-w-2xl mx-auto ${interrupted && "hidden"}`}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask me something..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              status={!isLoading ? "ready" : "streaming"}
              onStop={stop}
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
