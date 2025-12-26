import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/lib/middleware'

export const Route = createFileRoute('/(authed)')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  return <div>Hello "/(authed)"!</div>
}
