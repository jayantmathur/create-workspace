import type { Command } from "@langchain/protocol";
import { createFileRoute } from "@tanstack/react-router";

import { getSession } from "#/lib/ai/server/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { threadId: string };

/**
 * `POST /api/threads/$threadId/commands`
 *
 * The request body is an Agent Protocol {@link Command}. The response is the
 * command result emitted by the owning `LocalThreadSession`.
 */

export const Route = createFileRoute("/api/ai/threads/$threadId/commands")({
	server: {
		handlers: {
			POST: async ({
				request,
				params,
			}: {
				request: Request;
				params: Params;
			}) => {
				const { threadId } = params;
				const command = (await request.json()) as Command;
				const result = await getSession(threadId).handleCommand(command);
				return Response.json(result);
			},
		},
	},
});
