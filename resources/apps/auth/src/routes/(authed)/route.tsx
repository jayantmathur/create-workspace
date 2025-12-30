import { RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authed)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <Outlet />
      </SignedIn>
    </>
  )
}
