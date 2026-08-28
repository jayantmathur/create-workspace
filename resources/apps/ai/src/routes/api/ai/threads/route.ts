import { createFileRoute } from '@tanstack/react-router'
import { getAgentGraph, getCheckpointer } from '#/lib/ai/server/registry'
import { listThreads } from '#/lib/ai/server/threads'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** `GET /api/threads` — list every thread known to the checkpointer. */

export const Route = createFileRoute('/api/ai/threads')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const threads = await listThreads(getAgentGraph(), getCheckpointer())
        return Response.json(threads)
      },
    },
  },
})
