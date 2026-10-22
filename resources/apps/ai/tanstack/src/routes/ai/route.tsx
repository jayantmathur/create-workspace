import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ThreadsProvider } from "#/components/ai/thread-sidebar";

export const Route = createFileRoute("/ai")({ component: Layout });

function Layout() {
  return (
    <ThreadsProvider>
      <Outlet />
    </ThreadsProvider>
  );
}
