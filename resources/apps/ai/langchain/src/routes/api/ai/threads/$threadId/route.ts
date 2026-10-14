import { createFileRoute } from "@tanstack/react-router";
import { deleteThread } from "#/lib/ai/server/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { threadId: string };

/** `DELETE /api/threads/$threadId` — drop a thread's session and checkpoints. */

export const Route = createFileRoute("/api/ai/threads/$threadId")({
	server: {
		handlers: {
			DELETE: async ({
				request,
				params,
			}: {
				request: Request;
				params: Params;
			}) => {
				const { threadId } = params;
				await deleteThread(threadId);
				return new Response(null, { status: 204 });
			},
		},
	},
});
