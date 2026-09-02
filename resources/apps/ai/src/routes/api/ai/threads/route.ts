import { createFileRoute } from "@tanstack/react-router";
import { getAgentGraph, getCheckpointer } from "#/lib/ai/server/registry";
import { listThreads } from "#/lib/ai/server/threads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** `GET /api/threads` — list every thread known to the checkpointer. */
/** `POST /api/threads` — list only threads belonging to this browser tab. The request body should be a JSON object with a `threadIds` array of strings. */

export const Route = createFileRoute("/api/ai/threads")({
  server: {
    handlers: {
      GET: async () => {
        const threads = await listThreads(getAgentGraph(), getCheckpointer());
        return Response.json(threads);
      },
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          threadIds?: unknown;
        };

        const threadIds = Array.isArray(body.threadIds)
          ? body.threadIds.filter((id): id is string => typeof id === "string")
          : [];

        const threads = await listThreads(
          getAgentGraph(),
          getCheckpointer(),
          threadIds,
        );

        return Response.json(threads);
      },
    },
  },
});
