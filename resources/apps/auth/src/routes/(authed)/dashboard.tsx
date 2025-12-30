import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(authed)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Hello "/authed/dashboard"!</h1>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </>
  )
}
