import { CopyIcon, LoaderCircleIcon, MessageSquareIcon } from "lucide-react";
import type { UIMessage } from "@tanstack/ai-react";
import type { ChatClientState } from "@tanstack/ai-client";
import { CircleCheckIcon } from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "#/lib/utils";
import { Message, MessageContent, MessageFooter } from "./ui/message";
import { Bubble, BubbleContent } from "./ui/bubble";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
  MessageScrollerProvider,
} from "./ui/message-scroller";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./ui/empty";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  TraceLine,
  TraceTitle,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  Trace,
  TraceDescription,
  TraceIcon,
} from "./ui/trace";
import { Markdown } from "./markdown-wrapper";
import { useStopWatch } from "#/hooks/use-stop-watch";

function getMessageText(message: Pick<UIMessage, "parts">) {
  return message.parts.reduce(
    (text, part) => (part.type === "text" ? text + part.content : text),
    "",
  );
}

function ReasoningLine({
  text,
  thinking,
}: {
  text: string;
  thinking: boolean;
}) {
  const [open, setOpen] = useState<boolean>();
  const duration = useStopWatch(thinking);

  const line = (
    <TraceLine status={thinking ? "running" : undefined}>
      <TraceIcon>
        {thinking ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleCheckIcon />
        )}
      </TraceIcon>
      <TraceTitle>{thinking ? "Thinking" : "Done thinking"}</TraceTitle>
      {duration && (
        <TraceDescription>{Math.ceil(duration / 1000)}s</TraceDescription>
      )}
    </TraceLine>
  );

  if (text.length === 0) {
    return line;
  }

  return (
    <TraceCollapsible
      defaultOpen
      open={open ?? thinking}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        <Markdown>{text}</Markdown>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

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

export function Messages({
  messages,
  status,
}: {
  messages: UIMessage[];
  status: ChatClientState;
}) {
  if (messages.length === 0) return null;
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent
            aria-busy={status !== "ready"}
            className="p-4"
          >
            {messages.map((message, index) => {
              const { id, role, parts } = message;

              switch (role) {
                case "user":
                  return (
                    <MessageScrollerItem
                      key={`${id}-part-${index}`}
                      messageId={id}
                      scrollAnchor
                    >
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
                case "assistant":
                  const reasoning = parts.filter(
                    (part) => part.type === "thinking",
                  );

                  return (
                    <MessageScrollerItem
                      key={`${id}-part-${index}`}
                      messageId={id}
                      scrollAnchor
                    >
                      <Message>
                        <MessageContent>
                          {reasoning.length > 0 && (
                            <Trace>
                              {reasoning.map((reason, index) => {
                                const thinking =
                                  (status === "submitted" ||
                                    status === "streaming") &&
                                  reason === parts.at(-1);

                                return (
                                  <ReasoningLine
                                    key={`${id}-reasoning-${index}`}
                                    text={reason.content}
                                    thinking={thinking}
                                  />
                                );
                              })}
                            </Trace>
                          )}
                          <Markdown>{getMessageText(message)}</Markdown>
                          <MessageFooter>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Copy"
                                  disabled={status !== "ready"}
                                >
                                  <CopyIcon />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy</p>
                              </TooltipContent>
                            </Tooltip>
                          </MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                default:
                  return null;
              }
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
