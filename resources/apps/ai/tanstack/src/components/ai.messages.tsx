import { MessageSquareIcon } from "lucide-react";
import type { UIMessage } from "@tanstack/ai-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "#/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "#/components/ai-elements/message";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "#/components/ai-elements/reasoning";

const MessageParts = ({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: UIMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
}) => {
  // Consolidate all reasoning parts into one block
  const reasoningParts = message.parts.filter(
    (part) => part.type === "thinking",
  );
  const reasoningText = reasoningParts.map((part) => part.content).join("\n\n");
  const hasReasoning = reasoningParts.length > 0;

  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "thinking";

  return (
    <>
      {hasReasoning && (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <MessageResponse key={`${message.id}-${index}`}>
              {part.content}
            </MessageResponse>
          );
        }
        return null;
      })}
    </>
  );
};

export function Messages({
  messages,
  isStreaming,
}: {
  messages: UIMessage[];
  isStreaming: boolean;
}) {
  return (
    <Conversation className="flex-1">
      <ConversationContent>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Message
              // @ts-expect-error
              from={message.role}
              key={message.id}
            >
              <MessageContent>
                <MessageParts
                  message={message}
                  isLastMessage={index === messages.length - 1}
                  isStreaming={isStreaming}
                />
              </MessageContent>
            </Message>
          ))
        ) : (
          <ConversationEmptyState
            description="Messages will appear here as the conversation progresses."
            icon={<MessageSquareIcon className="size-6" />}
            title="Start a conversation"
          />
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
