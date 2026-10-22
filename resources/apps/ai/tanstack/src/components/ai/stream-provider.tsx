import { createContext, useContext } from "react";
import {
  useChat,
  fetchServerSentEvents,
  sessionStoragePersistence,
} from "@tanstack/ai-react";
import { createStore } from "@tanstack/react-store";
import { DEFAULT_MODEL } from "#/agents/models";
import {
  clearThreads,
  createThread,
  deleteThread,
  readThreads,
  updateThread as threadUpdate,
} from "#/agents/threads";
import type { SelectableModel, Thread, ReasoningEffort } from "#/agents/types";

type ChatProviderProps = {
  children: React.ReactNode;
  threadId: string;
  model: SelectableModel;
  reasoning: ReasoningEffort;
};

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null);

export function ChatProvider({
  children,
  threadId,
  model,
  reasoning,
}: ChatProviderProps) {
  const chat = useChat({
    threadId,
    connection: fetchServerSentEvents("/api/ai/chat"),
    forwardedProps: { model, reasoning },
    persistence: sessionStoragePersistence(),
  });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const chat = useContext(ChatContext);

  if (!chat) {
    throw new Error("useChatContext must be used within ChatProvider");
  }

  return chat;
}

type ThreadsStore = {
  threads: Thread[];
  current: Thread;
  model: SelectableModel;
  reasoning: ReasoningEffort;
};

function loadInitialState(): ThreadsStore {
  if (readThreads().length === 0) createThread();

  const threads = readThreads();
  const current = threads[0];

  return {
    threads,
    current,
    model: DEFAULT_MODEL,
    reasoning: "minimal",
  };
}

export const store = createStore<ThreadsStore>(loadInitialState());

export const actions = {
  selectThread(id: string) {
    store.setState((prev) => ({
      ...prev,
      current: prev.threads.find((thread) => thread.id === id) ?? prev.current,
    }));
  },

  createThread(title = "New chat"): Thread {
    const thread = createThread(title);

    store.setState((prev) => ({
      ...prev,
      threads: [
        thread,
        ...prev.threads.filter((item) => item.id !== thread.id),
      ],
      current: thread,
    }));

    return thread;
  },

  updateThread(
    id: string,
    updater: (thread: Thread) => Thread,
  ): Thread | undefined {
    const updated = threadUpdate(id, updater);

    if (!updated) return undefined;

    store.setState((prev) => ({
      ...prev,
      threads: prev.threads.map((thread) =>
        thread.id === id ? updated : thread,
      ),
    }));

    return updated;
  },

  deleteThread(id: string): boolean {
    const deleted = deleteThread(id);

    if (!deleted) return false;

    store.setState((prev) => {
      const remaining = prev.threads.filter((thread) => thread.id !== id);

      return {
        ...prev,
        threads: remaining,
        current:
          prev.current.id === id
            ? remaining.length > 0
              ? remaining[0]
              : createThread()
            : prev.current,
      };
    });

    return true;
  },

  clearAllThreads() {
    clearThreads();

    store.setState((prev) => ({
      ...prev,
      threads: readThreads(),
      current: createThread(),
    }));
  },

  refresh() {
    try {
      const latestThreads = readThreads();

      store.setState((prev) => ({
        ...prev,
        threads: latestThreads,
        current:
          latestThreads.find((thread) => thread.id === prev.current.id) ??
          prev.current,
      }));
    } catch {
      // Preserve the current store state if reading fails.
    }
  },
  updateAI({
    model,
    reasoning,
  }: {
    model?: SelectableModel;
    reasoning?: ReasoningEffort;
  }): void {
    store.setState((prev) => ({
      ...prev,
      model: model ?? prev.model,
      reasoning: reasoning ?? prev.reasoning,
    }));
  },
};
