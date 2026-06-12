import {
  FetchStreamTransport,
  useStream as useLegacyStream,
} from "@langchain/langgraph-sdk/react";
import type { AIMessage, BaseMessage, HITLResponse } from "langchain";
import { useMemo } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "#/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "#/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "#/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "#/components/ai-elements/reasoning";
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
import {
  getReasoningText,
  getToolCalls,
  extractTextContent,
  isAIMessage,
  isHumanMessage,
} from "#/lib/ai-utils";

export function AIChat() {
  const legacyTransport = useMemo(() => {
    return new FetchStreamTransport({
      apiUrl: "/api/agents/basic",
    });
  }, []);

  const stream = useLegacyStream({
    transport: legacyTransport,
    // assistantId: "assistant",
  });

  const { messages, isLoading, submit, stop, interrupt } = stream;

  const handleSubmit = (text: string) =>
    submit({
      messages: [{ type: "human" as const, content: text }] as BaseMessage[],
    });

  const handleReject = () =>
    submit({
      resume: {
        decisions: [
          {
            type: "reject",
            message:
              "User rejected this action. Do not retry this tool call and do not continue with next steps. Inform the user that you will stop as per their request. Clarify that this is because the action was rejected.",
          },
        ],
      } as HITLResponse,
    });

  const handleApprove = () =>
    submit({
      resume: {
        decisions: [{ type: "approve" }],
      } as HITLResponse,
    });

  return (
    <div className="flex flex-col h-dvh">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((msg, i) => {
            if (isHumanMessage(msg)) {
              return (
                <Message key={i} from="user">
                  <MessageContent>
                    {extractTextContent(msg.content)}
                  </MessageContent>
                </Message>
              );
            }
            if (isAIMessage(msg)) {
              return (
                <div key={i}>
                  {/* Reasoning block (shows when model emits thinking tokens) */}
                  <Reasoning defaultOpen>
                    <ReasoningTrigger />
                    <ReasoningContent>
                      {getReasoningText(msg as AIMessage)}
                    </ReasoningContent>
                  </Reasoning>

                  {/* Inline tool calls with input/output display */}
                  {getToolCalls(msg as AIMessage).map((tc) => (
                    <Tool key={tc.id} defaultOpen>
                      <ToolHeader type={`tool-${tc.name}`} state={tc.state} />
                      <ToolContent>
                        <ToolInput input={tc.args} />
                        {tc.output && (
                          <ToolOutput
                            output={tc.output}
                            errorText={undefined}
                          />
                        )}
                      </ToolContent>
                    </Tool>
                  ))}

                  {/* Streamed text response */}
                  <Message from="assistant">
                    <MessageContent>
                      <MessageResponse>
                        {extractTextContent(msg.content)}
                      </MessageResponse>
                    </MessageContent>
                  </Message>
                </div>
              );
            }
          })}
          {interrupt && (
            <Confirmation
              approval={{ id: nanoid() }}
              state="approval-requested"
            >
              <ConfirmationTitle>
                <ConfirmationRequest>
                  This tool wants to delete the file{" "}
                  <code className="inline rounded bg-muted px-1.5 py-0.5 text-sm">
                    /tmp/example.txt
                  </code>
                  . Do you approve this action?
                </ConfirmationRequest>
                <ConfirmationAccepted>
                  <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                  <span>You approved this tool execution</span>
                </ConfirmationAccepted>
                <ConfirmationRejected>
                  <XIcon className="size-4 text-destructive" />
                  <span>You rejected this tool execution</span>
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
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={({ text }) => (isLoading ? stop() : handleSubmit(text))}
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask me something..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status={isLoading ? "streaming" : "ready"} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
