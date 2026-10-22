import type { Thread } from "#/agents/types";

const STORAGE_KEY = import.meta.env.VITE_AI_THREADS_KEY || "ai:threads";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    // Storage can be blocked by browser privacy settings.
    return null;
  }
}

function makeId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readThreads(): Thread[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Thread[]) : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // Keep the in-memory thread store usable when storage is unavailable.
  }
}

export function createThread(title = "New chat"): Thread {
  const thread: Thread = {
    id: makeId(),
    title,
    createdAt: new Date().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  saveThreads([thread, ...readThreads()]);
  return thread;
}

/*

Sample usage"

const deleted = deleteThread(thread.id);

if (!deleted) {
  console.log("Thread not found.");
}

*/

export function deleteThread(id: string): boolean {
  const threads = readThreads();
  const remaining = threads.filter((thread) => thread.id !== id);

  if (remaining.length === threads.length) return false;

  saveThreads(remaining);
  return true;
}

/*

Sample usage:

updateThread(thread.id, (current) => ({
  ...current,
  title: "Session storage explained",
}));

*/
export function updateThread(
  id: string,
  updater: (thread: Thread) => Thread,
): Thread | undefined {
  let updated: Thread | undefined;

  const threads = readThreads().map((thread) => {
    if (thread.id !== id) return thread;

    const candidate = updater({
      ...thread,
    });

    // Prevent accidental identity changes.
    updated = {
      ...candidate,
      id: thread.id,
      createdAt: thread.createdAt,
    };

    return updated;
  });

  if (updated) saveThreads(threads);
  return updated;
}

export function clearThreads(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory store is already cleared.
  }
}
