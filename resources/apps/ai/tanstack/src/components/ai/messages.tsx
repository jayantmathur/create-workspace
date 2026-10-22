import { CopyIcon, MessageSquareIcon } from "lucide-react";
import { useCallback, useRef, type ComponentProps } from "react";
import { cn } from "#/lib/utils";
import { useChatContext } from "#/components/ai/stream-provider";
import { useSelector } from "@tanstack/react-store";
import { store } from "#/components/ai/stream-provider";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "#/components/ui/message";
import { Bubble, BubbleContent } from "#/components/ui/bubble";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
  MessageScrollerProvider,
} from "#/components/ui/message-scroller";
import { Button } from "#/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "#/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { Trace } from "#/components/ui/trace";
import { Markdown } from "#/components/ai/markdown-wrapper";
import { Badge } from "#/components/ui/badge";
import { ReasoningLine } from "#/components/ai/reasoning-line";
import { ToolCall } from "#/components/ai/tool-call";
import { SubagentDetails } from "#/components/ai/subagent-details";
import { getMessageText } from "#/lib/ai/utils";

export function SuggestionsHero({
  className,
  suggestions,
  onSelection,
}: ComponentProps<typeof Empty> & {
  suggestions: string[];
  onSelection: (text: string) => void;
}) {
  return (
    <Empty className={cn(className, "h-full")}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareIcon />
        </EmptyMedia>
        <EmptyTitle>Start a conversation</EmptyTitle>
        <EmptyDescription>
          Messages will appear here as the conversation progresses. Try one of
          the suggestions to get started!
        </EmptyDescription>
        <div className="flex justify-center p-2 gap-2 flex-wrap md:flex-nowrap">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="shrink-0"
              onPointerDown={() => onSelection(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </EmptyHeader>
    </Empty>
  );
}

export function Messages() {
  const { messages, interrupts, status } = useChatContext();
  const busy = status === "submitted" || status === "streaming";
  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  if (messages.length === 0) return null;
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent
            aria-busy={status !== "ready"}
            className="px-8 pb-8"
          >
            {messages.map((message, index) => {
              const { id, role, parts, metadata } = message;
              const key = `${role}/message${index}-${id}`;

              let modelUsed = metadata?.tanstack.model;

              if (role === "user")
                return (
                  <MessageScrollerItem key={key} messageId={id} scrollAnchor>
                    <Message align="end">
                      <MessageContent>
                        <Bubble align="end" variant="muted">
                          <BubbleContent>
                            {getMessageText(message)}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );

              // case "assistant"

              const response =
                getMessageText(message) ||
                parts
                  .flatMap((part) =>
                    part.type === "subagent"
                      ? part.subagent.messages
                          .filter(({ role }) => role === "assistant")
                          .map(getMessageText)
                      : [],
                  )
                  .at(-1);

              return (
                <MessageScrollerItem key={key} messageId={id}>
                  <Message>
                    <MessageContent>
                      <Trace>
                        {parts.map((part, index) => {
                          const { type } = part;
                          const partKey = `${key}/${type}${index}`;

                          switch (type) {
                            case "thinking":
                              return (
                                <ReasoningLine
                                  key={partKey}
                                  text={part.content}
                                  thinking={busy && index === parts.length - 1}
                                />
                              );
                            case "tool-call":
                              const interrupt = interrupts.find(
                                ({ interruptId }) => interruptId === part.id,
                              );
                              return (
                                <ToolCall
                                  key={partKey}
                                  toolcall={part}
                                  interrupt={interrupt}
                                />
                              );
                            case "subagent":
                              if (!modelUsed)
                                modelUsed =
                                  part.subagent.messages.at(-1)?.metadata
                                    ?.tanstack.model;
                              return (
                                <SubagentDetails
                                  key={partKey}
                                  subagent={part.subagent}
                                  interrupts={interrupts}
                                />
                              );
                            default:
                              return null;
                          }
                        })}
                      </Trace>
                      <Markdown>{response}</Markdown>
                      <MessageFooter className="space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Copy"
                              disabled={busy}
                              onPointerDown={() =>
                                !response ? void 0 : handleCopy(response)
                              }
                            >
                              <CopyIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge variant="outline">{modelUsed}</Badge>
                      </MessageFooter>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              );
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
