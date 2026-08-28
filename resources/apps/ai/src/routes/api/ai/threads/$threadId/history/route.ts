import { createFileRoute } from '@tanstack/react-router'
import { getAgentGraph } from '#/lib/ai/server/registry'
import { getThreadHistory, ThreadNotFoundError } from '#/lib/ai/server/threads'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Params = { threadId: string }

/** `POST /api/threads/$threadId/history` — list past checkpointed states. */
export const Route = createFileRoute('/api/ai/threads/$threadId/history')({
  server: {
    handlers: {
      POST: async ({
        request,
        params,
      }: {
        request: Request
        params: Params
      }) => {
        const { threadId } = params
        const body = (await request.json().catch(() => ({}))) as {
          limit?: number
          before?: unknown
          metadata?: Record<string, unknown>
          checkpoint?: Record<string, unknown>
        }
        try {
          const history = await getThreadHistory(getAgentGraph(), threadId, {
            limit: typeof body.limit === 'number' ? body.limit : 10,
            before: body.before,
            metadata: body.metadata,
            checkpoint: body.checkpoint,
          })
          return Response.json(history)
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
    },
  },
})
