import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware, checkAuth } from '@/middleware/auth'

export const Route = createFileRoute('/(authed)')({
  component: RouteComponent,
  beforeLoad: () => checkAuth(),
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  return <Outlet />
}
