import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authed)/example')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authed)/example"!</div>
}
