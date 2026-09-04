import { TavilySearch } from "@langchain/tavily";
import { tool } from "langchain";
import { interrupt } from "@langchain/langgraph";
import { z } from "zod";
import type { CustomInterrupt } from "./types";

const toolName = "internet_search";

export const internet_search = tool(
  async ({
    query,
    maxResults = 5,
    topic = "general",
    includeRawContent = false,
  }: {
    query: string;
    maxResults?: number;
    topic?: "general" | "news" | "finance";
    includeRawContent?: boolean;
  }) => {
    const response = interrupt({
      action: toolName,
      message: "Approve sending this internet search request?",
    } as CustomInterrupt["value"]);

    if (response?.action === "approve") {
      const tavilySearch = new TavilySearch({
        maxResults,
        tavilyApiKey: process.env.TAVILY_API_KEY,
        includeRawContent,
        topic,
      });
      return await tavilySearch._call({ query });
    }
    return "Internet search request was rejected by the user.";
  },
  {
    name: toolName,
    description: "Run a web search",
    schema: z.object({
      query: z.string().describe("The search query"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of results to return"),
      topic: z
        .enum(["general", "news", "finance"])
        .optional()
        .default("general")
        .describe("Search topic category"),
      includeRawContent: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether to include raw content"),
    }),
  },
);
