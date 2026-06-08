import { createFileRoute } from '@tanstack/react-router'
import { agent } from '#/routes/api/agents/basic/-agent'

export const Route = createFileRoute('/api/agents/basic')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Check for API key
          if (!process.env.OPENROUTER_API_KEY) {
            return new Response(
              JSON.stringify({
                error: 'OPENROUTER_API_KEY not configured',
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          const body = await request.json()

          // Get the agent stream
          return agent(body)
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : 'Internal server error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
