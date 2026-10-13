import type { ToolUIPart } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "#/components/ai-elements/tool";
import { HITLCard } from "./ai.hitl-card";

interface ToolCallProps {
  toolName: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  isStreaming?: boolean;
  interrupt: any;
}

export function ToolCall({
  toolName,
  input,
  output,
  error,
  isStreaming,
  interrupt,
}: ToolCallProps) {
  const state: ToolUIPart["state"] = error
    ? "output-error"
    : output !== undefined
      ? "output-available"
      : interrupt
        ? "approval-requested"
        : isStreaming
          ? "input-streaming"
          : "input-available";

  const hasResult = state === "output-available" || state === "output-error";

  return (
    <Tool defaultOpen={state==="approval-requested"}>
      <ToolHeader
        type={`tool-${toolName}` as ToolUIPart["type"]}
        state={state}
      />
      <ToolContent>
        <ToolInput input={input} />
        <HITLCard
          interrupt={interrupt}
          className={`w-full min-w-0 ${!interrupt || hasResult && "hidden"}`}
        />
        {error && <ToolOutput output={undefined} errorText={error} />}
      </ToolContent>
    </Tool>
  );
}
