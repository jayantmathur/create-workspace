import type { SubagentHandleData } from "@tanstack/ai";
import type { BoundInterrupts, ToolCallPart } from "@tanstack/ai-client";
import { Fragment } from "react/jsx-runtime";
import { CircleCheckIcon, LoaderCircleIcon } from "lucide-react";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "#/components/ui/trace";
import { Badge } from "#/components/ui/badge";

import { ReasoningLine } from "#/components/ai/reasoning-line";
import { ToolCall } from "#/components/ai/tool-call";

export function SubagentDetails({
  subagent,
  interrupts,
}: {
  subagent: SubagentHandleData;
  interrupts: BoundInterrupts;
}) {
  const { name, messages, status, id } = subagent;
  const busy = status === "running";
  const key = `subagent:${name}/${id}`;
  const modelUsed =
    messages.find(({ role }) => role === "assistant")?.metadata?.tanstack
      .model ?? undefined;

  if (messages.length === 0) return null;

  return (
    <TraceCollapsible defaultOpen key={key}>
      <TraceCollapsibleTrigger>
        <TraceLine status={(status as "error" | "running") ?? undefined}>
          <TraceIcon>
            {busy ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CircleCheckIcon />
            )}
          </TraceIcon>
          <TraceTitle>
            {status === "error"
              ? "ERROR: "
              : status === "finished"
                ? "Finished: "
                : null}
            Consulting subagent
          </TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-mono">
            {name}
          </Badge>
          <Badge variant="secondary">{modelUsed}</Badge>
        </div>
        {/* <p className="text-xs italic">
          <strong>Request for Information: </strong>
          {description}
        </p> */}
        {messages.map((message, index) => {
          const { id, role, parts } = message;
          const key = `sub${role}/message${index}-${id}`;

          return (
            <Fragment key={key}>
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
                        (interrupt) =>
                          interrupt.interruptId ===
                          (part as ToolCallPart).approval?.id,
                      );
                      return (
                        <ToolCall
                          key={partKey}
                          toolcall={part}
                          interrupt={interrupt}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </Trace>
            </Fragment>
          );
        })}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}
