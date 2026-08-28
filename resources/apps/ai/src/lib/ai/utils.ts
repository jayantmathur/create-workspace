import { AIMessage, HumanMessage } from 'langchain'

export function isAIMessage(message: unknown): boolean {
  // Early return for falsy values or non-objects
  if (!message || typeof message !== 'object') return false

  const msg = message as Record<string, unknown>

  // Check SDK serialized format first (most common in streaming scenarios)
  if (msg.type === 'ai') return true

  // Fallback to LangChain Core instance check
  return AIMessage.isInstance(message)
}

export function isHumanMessage(message: unknown): boolean {
  // Early return for falsy values or non-objects
  if (!message || typeof message !== 'object') return false

  const msg = message as Record<string, unknown>

  // Check SDK serialized format first (most common in streaming scenarios)
  if (msg.type === 'human') return true

  // Fallback to LangChain Core instance check
  return HumanMessage.isInstance(message)
}

export function getReasoningText(msg: AIMessage) {
  return (
    msg.contentBlocks.find((block) => block.type === 'reasoning')?.reasoning ??
    ''
  )
}

export function getTextContent(msg: AIMessage) {
  return msg.text
}

export function getToolCalls(msg: AIMessage) {
  return (msg.tool_calls ?? []).map((tc) => ({
    id: tc.id,
    name: tc.name,
    args: tc.args,
    state: 'input-available' as const,
  }))
}
