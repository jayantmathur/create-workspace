import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { ChatSession } from "#/components/ai/chat";
import { store, ChatProvider } from "#/components/ai/stream-provider";

export const Route = createFileRoute("/ai/")({
  component: AI,
});

function AI() {
  const { current, model, reasoning } = useSelector(store);
  return (
    <ChatProvider threadId={current?.id} model={model} reasoning={reasoning}>
      <ChatSession />
    </ChatProvider>
  );
}

/*

*import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
*  beforeLoad: () => {
*    throw redirect({ to: "/ai" });
  },
});

*/
