import type { ToolUIPart } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "#/components/ai-elements/tool";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "#/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useStreamContext } from "@langchain/react";
import type { Agent } from "#/agents/basic/agent";

interface ToolCallProps {
  toolName: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  isStreaming?: boolean;
  interruptId?: string;
}

export function ToolCall({
  toolName,
  input,
  output,
  error,
  isStreaming,
  interruptId,
}: ToolCallProps) {
  const stream = useStreamContext<Agent>();
  const { respond } = stream;
  const state: ToolUIPart["state"] = interruptId
    ? "approval-requested"
    : error
      ? "output-error"
      : output !== undefined
        ? "output-available"
        : isStreaming
          ? "input-streaming"
          : "input-available";

  const hasResult = state === "output-available" || state === "output-error";

  const handleReject = () =>
    respond(
      { approved: false },
      {
        interruptId: interruptId,
        update: {
          messages: [{ type: "ai", content: "Rejected by user." }],
        },
      },
    );

  const handleApprove = () =>
    respond(
      { approved: true },
      {
        interruptId: interruptId,
        update: {
          messages: [{ type: "ai", content: "Approved by user." }],
        },
      },
    );

  return (
    <Tool defaultOpen={!hasResult}>
      <ToolHeader
        type={`tool-${toolName}` as ToolUIPart["type"]}
        state={state}
      />
      <ToolContent>
        <ToolInput input={input} />
        <Confirmation approval={{ id: nanoid() }} state={state}>
          <ConfirmationTitle>
            <ConfirmationRequest>
              This tool needs approval to proceed. Do you approve this
              execution?
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <p className="flex flex-row space-x-2 place-items-center">
                <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                <span>You approved this tool execution</span>
              </p>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <p className="flex flex-row space-x-2 place-items-center">
                <XIcon className="size-4 text-destructive" />
                <span>You rejected this tool execution</span>
              </p>
            </ConfirmationRejected>
          </ConfirmationTitle>
          <ConfirmationActions>
            <ConfirmationAction onClick={handleReject} variant="outline">
              Reject
            </ConfirmationAction>
            <ConfirmationAction onClick={handleApprove} variant="default">
              Approve
            </ConfirmationAction>
          </ConfirmationActions>
        </Confirmation>

        {hasResult && (
          <ToolOutput
            output={output}
            errorText={error}
            className="w-full max-w-2xl"
          />
        )}
      </ToolContent>
    </Tool>
  );
}
