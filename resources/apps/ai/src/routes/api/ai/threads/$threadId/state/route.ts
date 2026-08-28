import { createFileRoute } from '@tanstack/react-router'
import { getAgentGraph } from '#/lib/ai/server/registry'
import {
  getThreadState,
  ThreadNotFoundError,
  updateThreadState,
} from '#/lib/ai/server/threads'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Params = { threadId: string }

/** `GET /api/threads/$threadId/state` — read checkpointed thread state. */
/** `POST /api/threads/$threadId/state` — create or update thread state. */
export const Route = createFileRoute('/api/ai/threads/$threadId/state')({
  server: {
    handlers: {
      GET: async ({
        request,
        params,
      }: {
        request: Request
        params: Params
      }) => {
        const { threadId } = params
        try {
          const state = await getThreadState(getAgentGraph(), threadId)
          return Response.json(state)
        } catch (error) {
          if (error instanceof ThreadNotFoundError) {
            return Response.json(
              { error: 'not_found', message: error.message },
              { status: 404 },
            )
          }
          throw error
        }
      },
      POST: async ({
        request,
        params,
      }: {
        request: Request
        params: Params
      }) => {
        const { threadId } = params
        const body = (await request.json().catch(() => ({}))) as {
          values?: Record<string, unknown> | null
          checkpoint?: Record<string, unknown> | null
          as_node?: string
        }
        try {
          const state = await updateThreadState(getAgentGraph(), threadId, {
            values: body.values ?? null,
            checkpoint: body.checkpoint ?? null,
            asNode: body.as_node,
          })
          return Response.json(state)
        } catch (error) {
          return Response.json(
            { error: 'invalid_state_update', message: String(error) },
            { status: 422 },
          )
        }
      },
    },
  },
})
