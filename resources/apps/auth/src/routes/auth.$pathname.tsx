import { AuthView } from '@neondatabase/neon-js/auth/react/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/$pathname')({
  component: Auth,
})

function Auth() {
  const { pathname } = Route.useParams()
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthView pathname={pathname} />
      </div>
    </div>
  )
}
