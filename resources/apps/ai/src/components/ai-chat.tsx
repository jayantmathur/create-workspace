import {
  HttpAgentServerAdapter,
  StreamProvider,
  useStreamContext,
} from '@langchain/react'
import type { AIMessage, BaseMessage, HITLResponse } from 'langchain'
import { CheckIcon, MessageSquare, XIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Agent } from '#/agents/basic/agent'
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from '#/components/ai-elements/confirmation'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import {
  createThread,
  deleteThread,
  fetchThreads,
  getApiUrl,
  type ThreadSummary,
} from '#/lib/ai/chat/threads-client'
import {
  getReasoningText,
  getTextContent,
  getToolCalls,
  isAIMessage,
  isHumanMessage,
} from '#/lib/ai/utils'
import { ThreadHistory } from './thread-history'

export function AIChat() {
  const [mounted, setMounted] = useState(false)
  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [threadId, setThreadId] = useState<string>('')
  // Guards the one-time init against React Strict Mode's double-invoke in dev,
  // which would otherwise create two threads when none exist yet.
  const initStarted = useRef(false)

  const refreshThreads = useCallback(async () => {
    setThreads(await fetchThreads())
  }, [])

  // On mount, load threads from the server (single source of truth). If none
  // exist yet, create one. All setState happens in an async callback, so the
  // effect body never calls setState synchronously.
  useEffect(() => {
    if (initStarted.current) return
    initStarted.current = true
    void (async () => {
      const list = await fetchThreads()
      if (list.length > 0) {
        setThreads(list)
        setThreadId(list[0].id)
      } else {
        const id = await createThread()
        setThreads(await fetchThreads())
        setThreadId(id)
      }
      setMounted(true)
    })()
  }, [])

  const transport = useMemo(() => {
    if (!threadId) return null
    return new HttpAgentServerAdapter({
      apiUrl: getApiUrl(),
      threadId,
      paths: {
        commands: `/threads/${threadId}/commands`,
        stream: `/threads/${threadId}/stream`,
        state: `/threads/${threadId}/state`,
      },
    })
  }, [threadId])

  const handleSelect = useCallback(
    (id: string) => {
      if (id !== threadId) setThreadId(id)
    },
    [threadId],
  )

  const handleCreate = useCallback(async () => {
    const id = await createThread()
    await refreshThreads()
    setThreadId(id)
  }, [refreshThreads])

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteThread(id)
      const list = await fetchThreads()
      setThreads(list)
      if (id !== threadId) return
      if (list.length > 0) {
        setThreadId(list[0].id)
      } else {
        const freshId = await createThread()
        setThreads(await fetchThreads())
        setThreadId(freshId)
      }
    },
    [threadId],
  )

  if (!mounted || !threadId || !transport) {
    return <div className="empty-state center">Preparing chat…</div>
  }

  return (
    <div className="flex flex-row w-full">
      <ThreadHistory
        activeThreadId={threadId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onSelect={handleSelect}
        threads={threads}
      />
      <StreamProvider key={threadId} threadId={threadId} transport={transport}>
        <Chat threadId={threadId} />
      </StreamProvider>
    </div>
  )
}

function Chat({ threadId }: { threadId: string }) {
  const stream = useStreamContext<Agent>()

  const { messages, isLoading, submit, stop, interrupt, toolCalls } = stream

  const handleSubmit = (text: string) =>
    submit({ messages: [{ type: 'human', content: text }] })

  return (
    <div className="flex flex-col h-dvh p-8">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="Start a conversation"
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((msg, i) => {
              if (isHumanMessage(msg)) {
                return (
                  <Message key={i} from="user">
                    <MessageContent>{msg.text}</MessageContent>
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
                      //                   <Tool key={tc.id} >
                      //   <ToolHeader
                      //     // state={"approval-requested" as ToolUIPart["state"]}
                      //     type={`tool-${tc.name}`} state={tc.state}
                      //   />
                      //   <ToolContent>
                      //     <ToolInput input={toolCall.input} />
                      //     <Confirmation approval={{ id: nanoid() }} state="approval-requested">
                      //       <ConfirmationTitle>
                      //         <ConfirmationRequest>
                      //           This tool will execute a query on the production database.
                      //         </ConfirmationRequest>
                      //         <ConfirmationAccepted>
                      //           <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                      //           <span>Accepted</span>
                      //         </ConfirmationAccepted>
                      //         <ConfirmationRejected>
                      //           <XIcon className="size-4 text-destructive" />
                      //           <span>Rejected</span>
                      //         </ConfirmationRejected>
                      //       </ConfirmationTitle>
                      //       <ConfirmationActions>
                      //         <ConfirmationAction onClick={handleReject} variant="outline">
                      //           Reject
                      //         </ConfirmationAction>
                      //         <ConfirmationAction onClick={handleAccept} variant="default">
                      //           Accept
                      //         </ConfirmationAction>
                      //       </ConfirmationActions>
                      //     </Confirmation>
                      //   </ToolContent>
                      // </Tool>
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
                        <MessageResponse>{getTextContent(msg)}</MessageResponse>
                      </MessageContent>
                    </Message>
                  </div>
                )
              }
            })
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={({ text }) => handleSubmit(text)}>
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
