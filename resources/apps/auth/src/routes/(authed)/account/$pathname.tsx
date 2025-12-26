import { AccountView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authed)/account/$pathname')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pathname } = Route.useParams()
  return <AccountView pathname={pathname} />
}
