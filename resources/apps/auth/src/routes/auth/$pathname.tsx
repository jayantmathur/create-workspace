import { AuthView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/$pathname')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pathname } = Route.useParams()

  return <AuthView pathname={pathname} />
}
