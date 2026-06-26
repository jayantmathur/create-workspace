import { createFileRoute } from '@tanstack/react-router'
import { AIChat } from '#/components/ai-chat'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="px-8">
      <AIChat />
    </div>
  )
}
