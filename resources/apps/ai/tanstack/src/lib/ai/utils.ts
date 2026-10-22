import type { UIMessage } from "@tanstack/ai-react";

export function getMessageText(message: Pick<UIMessage, "parts">) {
  return message.parts.reduce(
    (text, part) => (part.type === "text" ? text + part.content : text),
    "",
  );
}
