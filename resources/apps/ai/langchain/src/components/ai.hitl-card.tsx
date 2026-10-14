import { useState } from "react";
import { useStreamContext } from "@langchain/react";
import { nanoid } from "nanoid";
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationActions,
  ConfirmationAction,
} from "#/components/ai-elements/confirmation";
import type { ConfirmationProps } from "#/components/ai-elements/confirmation";
import type { Agent } from "#/agents/basic/agent";
import type { HITLRequest, HITLResponse } from "langchain";
import { cn } from "#/lib/utils";

type HITLProps = Omit<ConfirmationProps, "state" | "approval"> & {
  interrupt?: { id: string; value: HITLRequest };
};

export function HITLCard({ className, interrupt, ...props }: HITLProps) {
  if (!interrupt) return null;

  const { respond } = useStreamContext<Agent>();
  const [response, setResponse] = useState<ConfirmationProps>({
    approval: { id: "placeholder-id" },
    state: "approval-requested",
  });
  const { id, value } = interrupt;
  const { actionRequests } = value;
  const { description } = actionRequests[0];

  const handleApprove = async () =>
    await respond(
      {
        decisions: [
          {
            type: "approve",
          },
        ],
      } as HITLResponse,
      { interruptId: id },
    ).then(() =>
      setResponse({
        approval: {
          id: id || nanoid(),
          approved: true,
        },
        state: "approval-responded",
      }),
    );

  const handleReject = async () =>
    await respond(
      {
        decisions: [
          {
            type: "reject" as const,
            message:
              "Rejected by user. Do not retry tool this execution unless asked again. Inform the user accordingly.",
          },
        ],
      } as HITLResponse,
      { interruptId: id },
    ).then(() =>
      setResponse({
        approval: {
          id: id || nanoid(),
          approved: false,
          reason: "Rejected by user.",
        },
        state: "output-denied",
      }),
    );

  return (
    <Confirmation
      className={cn(className, "max-w-xl")}
      {...response}
      {...props}
    >
      <ConfirmationTitle>
        <ConfirmationRequest>{description}</ConfirmationRequest>
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
  );
}
