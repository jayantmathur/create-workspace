import {
  FetchStreamTransport,
  useStream as useLegacyStream,
} from '@langchain/langgraph-sdk/react'
import type { AIMessage } from 'langchain'
import { useMemo } from 'react'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '#/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '#/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '#/components/ai-elements/reasoning'
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '#/components/ai-elements/tool'
import { extractTextContent, isAIMessage, isHumanMessage } from '#/lib/ai-utils'

function getReasoningText(msg: AIMessage) {
  return msg.additional_kwargs.reasoning_content ?? ''
}

function getToolCalls(msg: AIMessage) {
  return (msg.tool_calls ?? []).map((tc) => ({
    id: tc.id,
    name: tc.name,
    args: tc.args,
    state: 'input-available' as const,
  }))
}

export function AIChat() {
  const legacyTransport = useMemo(() => {
    return new FetchStreamTransport({
      apiUrl: '/api/chat',
    })
  }, [])

  const stream = useLegacyStream({
    transport: legacyTransport,
    // assistantId: "assistant",
  })

  const { messages, isLoading, submit: sendMessage, stop } = stream

  return (
    <div className="flex flex-col p-8 h-dvh">
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
              )
            }
            if (isAIMessage(msg)) {
              return (
                <div key={i}>
                  {/* Reasoning block (shows when model emits thinking tokens) */}
                  <Reasoning>
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
              )
            }
            return null
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={({ text }) =>
          isLoading
            ? stop()
            : sendMessage({
                messages: [{ type: 'human', content: text }],
              })
        }
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask me something..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status={isLoading ? 'streaming' : 'ready'} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
