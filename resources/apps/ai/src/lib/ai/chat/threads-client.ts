/**
 * Browser-side thread helpers.
 *
 * The server (the agent's in-memory checkpointer) is the single source of truth
 * for threads. There is no client-side cache: the sidebar is always fetched
 * from the API, and restarting the server clears every thread.
 */

import { Client } from "@langchain/langgraph-sdk/client";

/** LangGraph SDK base URL. Route handlers live under `/api/threads/...`. */
export function getApiUrl(): string {
  return `${window.location.origin}/api/ai`;
}

/** Summary of a thread for the history sidebar (mirrors the server type). */
export type ThreadSummary = {
  id: string;
  title: string;
  updatedAt: string | null;
};

const THREADS_KEY = "ai-thread-ids";

function getStoredThreadIds(): string[] {
  try {
    const raw = sessionStorage.getItem(THREADS_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

/** Fetch threads from the server or only belonging to this browser tab, newest first. */

export async function fetchThreads(): Promise<ThreadSummary[]> {
  const threadIds = getStoredThreadIds();

  if (threadIds.length === 0) return [];

  // const response = await fetch(`${getApiUrl()}/threads`, { cache: "no-store" }); // GET /threads returns all threads and POST returns the thread IDs only for this tab instead.

  const response = await fetch(`${getApiUrl()}/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ threadIds }),
    cache: "no-store",
  });

  if (!response.ok) return [];

  return (await response.json()) as ThreadSummary[];
}

/**
 * Create the thread row server-side so hydration does not 404.
 *
 * Calls `GET /threads/:id/state` and, on 404, bootstraps with
 * `POST /threads/:id/state` and empty `messages`.
 */
async function ensureThreadExists(threadId: string) {
  const client = new Client({ apiUrl: getApiUrl() });
  try {
    await client.threads.getState(threadId);
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (status !== 404) throw error;
    await client.threads.updateState(threadId, { values: { messages: [] } });
  }
}

/** Mint a new thread and bootstrap its checkpoint on the server. */
export async function createThread(): Promise<string> {
  const id = crypto.randomUUID();

  await ensureThreadExists(id);

  // These lines only matter for sessionStorage thread IDs. The server will always be the source of truth for threads.
  const ids = getStoredThreadIds();
  sessionStorage.setItem("ai-thread-ids", JSON.stringify([id, ...ids]));

  // Keep this always
  return id;
}

/** Delete a thread (session + checkpointed state) on the server. */
export async function deleteThread(threadId: string): Promise<void> {
  await fetch(`${getApiUrl()}/threads/${threadId}`, {
    method: "DELETE",
  });

  // These lines only matter for sessionStorage thread IDs. The server will always be the source of truth for threads.
  const ids = getStoredThreadIds().filter((id) => id !== threadId);
  sessionStorage.setItem("ai-thread-ids", JSON.stringify(ids));
}
