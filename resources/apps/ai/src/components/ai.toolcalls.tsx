import type { ToolUIPart } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "#/components/ai-elements/tool";
import type { CustomInterrupt } from "#/agents/basic/tools/types";
import { HITLCard } from "./ai.hitl-card";

interface ToolCallProps {
  toolName: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  isStreaming?: boolean;
  interrupt?: CustomInterrupt;
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
      : isStreaming
        ? "input-streaming"
        : "input-available";

  const hasResult = state === "output-available" || state === "output-error";

  return (
    <Tool defaultOpen={!hasResult}>
      <ToolHeader
        type={`tool-${toolName}` as ToolUIPart["type"]}
        state={state}
      />
      <ToolContent>
        <ToolInput input={input} />
        {interrupt && <HITLCard {...interrupt} />}

        {hasResult && (
          <ToolOutput
            output={output}
            errorText={error}
            className="w-full max-w-2xl overflow-scroll"
          />
        )}
      </ToolContent>
    </Tool>
  );
}
