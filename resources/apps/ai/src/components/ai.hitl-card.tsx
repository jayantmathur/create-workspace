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

export function HITLCard({
  className,
  ...props
}: Omit<ConfirmationProps, "state" | "approval">) {
  const stream = useStreamContext<Agent>();
  const { respond, values } = stream;
  const interrupts: {
    id: string;
    value: HITLRequest;
  }[] = values.__interrupt__ ?? [];

  const interrupt = interrupts[0];

  if (!interrupt) return null;

  const [response, setResponse] = useState<ConfirmationProps>({
    approval: { id: interrupt.id || "placeholder-id" },
    state: "approval-requested",
  });

  const { actionRequests } = interrupt.value as HITLRequest;
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
      { interruptId: interrupt.id },
    ).then(() =>
      setResponse({
        approval: {
          id: interrupt.id || nanoid(),
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
      { interruptId: interrupt.id },
    ).then(() =>
      setResponse({
        approval: {
          id: interrupt.id || nanoid(),
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
