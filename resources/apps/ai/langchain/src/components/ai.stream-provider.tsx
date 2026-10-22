import { HttpAgentServerAdapter, StreamProvider } from "@langchain/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createThread,
  deleteThread,
  fetchThreads,
  getApiUrl,
  type ThreadSummary,
} from "#/lib/ai/chat/threads-client";
import { ThreadHistory } from "./ai.thread-history";

type Props = PropsWithChildren<{ loading?: string }>;

export function AIStreamProvider({ children, loading }: Props) {
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
      <span className="grid place-content-center w-full h-dvh">
        {loading || "Preparing chat…"}
      </span>
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
        {children}
      </StreamProvider>
    </div>
  );
}

/*

Example usage

import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
*import { AIStreamProvider } from "#/components/ai.stream-provider";

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
*       <AIStreamProvider loading={"Loading..."}>
*         {children}
*       </AIStreamProvider>
        <Scripts />
      </body>
    </html>
  );
}

*/
