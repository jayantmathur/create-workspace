import type { ThreadSummary } from '#/lib/ai/chat/threads-client'
import { Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'

function formatTime(updatedAt: string | null) {
  if (!updatedAt) return ''
  const date = new Date(updatedAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ThreadHistory({
  threads,
  activeThreadId,
  onSelect,
  onCreate,
  onDelete,
}: {
  threads: ThreadSummary[]
  activeThreadId: string
  onSelect: (threadId: string) => void
  onCreate: () => void
  onDelete: (threadId: string) => void
}) {
  return (
    <aside aria-label="Thread history" className="sidebar">
      <div className="sidebar-head">
        <span className="eyebrow">History</span>
        <button className="new-thread" onClick={onCreate} type="button">
          + New
        </button>
      </div>

      <ul className="thread-list">
        {threads.length === 0 ? (
          <li className="thread-empty">No conversations yet.</li>
        ) : null}
        {threads.map((thread) => (
          <li
            className={`thread-item ${
              thread.id === activeThreadId ? 'active' : ''
            }`}
            key={thread.id}
          >
            <Button
              variant={"secondary"}
              onClick={() => onSelect(thread.id)}
              
            >
              <span className="thread-title">{thread.title}</span>
              <span className="thread-time">
                {formatTime(thread.updatedAt)}
              </span>
            </Button>
            <Button
              size={"icon"}
              variant={"destructive"}
              onClick={() => onDelete(thread.id)}
            >
              <Trash2Icon/>
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
