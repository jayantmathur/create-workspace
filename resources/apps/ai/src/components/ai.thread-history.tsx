import { Trash2Icon } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "#/components/ui/item";
import type { ThreadSummary } from "#/lib/ai/chat/threads-client";

function formatTime(updatedAt: string | null) {
	if (!updatedAt) return "";
	const date = new Date(updatedAt);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export function ThreadHistory({
	threads,
	activeThreadId,
	onSelect,
	onCreate,
	onDelete,
}: {
	threads: ThreadSummary[];
	activeThreadId: string;
	onSelect: (threadId: string) => void;
	onCreate: () => void;
	onDelete: (threadId: string) => void;
}) {
	return (
		<section className="flex w-full max-w-md flex-col p-8">
			<header className="flex flex-row place-content-between">
				<h3>Chat History</h3>
				<Button onClick={onCreate}>New Chat</Button>
			</header>
			<aside className="gap-4 py-8">
				{threads.length === 0 ? (
					<Item variant={"outline"}>
						<ItemContent>
							<ItemDescription>No converstations yet.</ItemDescription>
						</ItemContent>
					</Item>
				) : null}
				{threads.map((thread) => {
					const isActive = thread.id === activeThreadId;
					return (
						<Item
							className={isActive ? "" : "opacity-25"}
							variant={isActive ? "outline" : "muted"}
							key={thread.id}
							onClick={() => onSelect(thread.id)}
						>
							<ItemContent>
								<ItemTitle>{formatTime(thread.updatedAt)}</ItemTitle>
								<ItemDescription>{thread.title}</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button
									size={"icon"}
									variant={"destructive"}
									onClick={() => onDelete(thread.id)}
									disabled={!isActive}
								>
									<Trash2Icon />
								</Button>
							</ItemActions>
						</Item>
					);
				})}
			</aside>
		</section>
	);
}
