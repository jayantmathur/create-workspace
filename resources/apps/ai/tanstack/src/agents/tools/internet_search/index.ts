import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const definition = toolDefinition({
  name: "internet_search",
  description: "Run a web search",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results to return"),
    searchDepth: z
      .enum(["advanced", "basic", "fast", "ultra-fast"])
      .optional()
      .default("basic")
      .describe(
        "Control the latency vs. relevance tradeoff and how results are generated",
      ),
  }),
  needsApproval: true,
});

// Create server implementation
export const internet_search = definition.server(
  async ({
    query,
    maxResults = 5,
    searchDepth = "basic",
  }: {
    query: string;
    maxResults?: number;
    searchDepth?: string;
  }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) throw new Error("API key is not configured");

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: query,
        max_results: maxResults,
        search_depth: searchDepth,
      }),
    });

    const data = await response.json();
    return data;
  },
);
