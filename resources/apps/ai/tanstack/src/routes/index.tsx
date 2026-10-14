import { createFileRoute } from "@tanstack/react-router";
import { AIChatInterface } from "#/components/ai.chat";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AIChatInterface />;
}
