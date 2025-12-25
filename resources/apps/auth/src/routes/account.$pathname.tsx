import { AccountView } from '@neondatabase/neon-js/auth/react/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/$pathname')({
  component: Account,
})

function Account() {
  const { pathname } = Route.useParams()
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AccountView pathname={pathname} />
      </div>
    </div>
  )
}
