import { useState } from "react";
import { useStreamContext } from "@langchain/react";
import { nanoid } from "nanoid";
import type { CustomInterrupt } from "#/agents/basic/tools/types";
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationActions,
  ConfirmationAction,
} from "#/components/ai-elements/confirmation";
import type { ConfirmationProps } from "#/components/ai-elements/confirmation";
import type { Agent } from "#/agents/basic/agent";

export function HITLCard(interrupt: CustomInterrupt) {
  const stream = useStreamContext<Agent>();
  const [response, setResponse] = useState<ConfirmationProps>({
    approval: { id: interrupt.id || "placeholder-id" },
    state: "approval-requested",
  });

  const {
    id: interruptId,
    value: { message } = {
      message: "Approve this action?",
    },
  } = interrupt;
  const { respond } = stream;

  const handleReject = () =>
    respond(
      { action: "reject" },
      {
        interruptId: interruptId,
        update: {
          messages: [{ type: "ai", content: "Rejected by user." }],
        },
      },
    ).then(() =>
      setResponse({
        approval: {
          id: interruptId || nanoid(),
          approved: false,
          reason: "Rejected by user.",
        },
        state: "output-denied",
      }),
    );

  const handleApprove = () =>
    respond({ action: "approve" }, { interruptId: interruptId }).then(() =>
      setResponse({
        approval: {
          id: interruptId || nanoid(),
          approved: true,
          reason: "Approved by user.",
        },
        state: "approval-responded",
      }),
    );

  return (
    <Confirmation {...response}>
      <ConfirmationTitle>
        <ConfirmationRequest>{message}</ConfirmationRequest>
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
