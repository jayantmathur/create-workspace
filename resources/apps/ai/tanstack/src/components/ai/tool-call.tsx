import type {
  ChatInterrupt,
  BoundInterrupts,
  ToolCallPart,
} from "@tanstack/ai-client";
import { TerminalIcon } from "lucide-react";
import { TraceLine, TraceIcon, TraceTitle, Trace } from "#/components/ui/trace";
import { Button } from "#/components/ui/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "#/components/ui/item";

export function ToolCall({
  toolcall,
  interrupt,
}: {
  toolcall: ToolCallPart;
  interrupt?: ChatInterrupt;
}) {
  const { state, id, name, approval, input } = toolcall;

  if (!approval)
    return (
      <TraceLine status={state !== "complete" ? "running" : undefined}>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>
          {state === "complete" ? "Ran" : "Running"} {name}
        </TraceTitle>
      </TraceLine>
    );

  if (
    state === "approval-requested" &&
    interrupt &&
    interrupt.kind === "generic"
  ) {
    return (
      <Item key={id} variant="outline" size="sm">
        <ItemMedia variant="icon">
          <TerminalIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Run {name}?</ItemTitle>
          <ItemDescription className="flex flex-col">
            <span>Tool Parameters</span>
            <code>{JSON.stringify(input, null, 2)}</code>
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            size="sm"
            variant="outline"
            onPointerDown={() => interrupt.resolveInterrupt(false)}
            disabled={!interrupt.canResolve}
          >
            Deny
          </Button>
          <Button
            size="sm"
            onPointerDown={() => interrupt.resolveInterrupt(true)}
            disabled={!interrupt.canResolve}
          >
            Approve
          </Button>
        </ItemActions>
      </Item>
    );
  }

  const status =
    state === "approval-requested"
      ? "pending"
      : state === "error"
        ? "error"
        : state === "approval-responded" && !approval?.approved
          ? "denied"
          : state === "complete"
            ? "ran"
            : "running";

  return (
    <TraceLine
      status={(status as "error" | "pending" | "running") ?? undefined}
    >
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {status.toUpperCase()}: {name}
      </TraceTitle>
    </TraceLine>
  );
}

// export function ToolCalls({
//   values = [],
//   interrupts = [],
// }: {
//   values: ToolCallPart[];
//   interrupts: BoundInterrupts;
// }) {
//   if (values.length === 0) return null;
//   return (
//     <>
//       {values.map((toolcall, index) => {
//         const interrupt = interrupts.find(
//           ({ interruptId }) => interruptId === toolcall.id,
//         );

//         return (
//           <ToolCall
//             key={`${toolcall.id}-${index}`}
//             toolcall={toolcall}
//             interrupt={interrupt}
//           />
//         );
//       })}
//     </>
//   );
// }
