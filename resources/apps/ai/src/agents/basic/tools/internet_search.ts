import { TavilySearch } from '@langchain/tavily'
import { tool } from 'langchain'
import { z } from 'zod'

const toolName = 'internet_search'

export const internet_search = tool(
  async ({
    query,
    maxResults = 5,
    topic = 'general',
    includeRawContent = false,
  }: {
    query: string
    maxResults?: number
    topic?: 'general' | 'news' | 'finance'
    includeRawContent?: boolean
  }) => {
    const tavilySearch = new TavilySearch({
      maxResults,
      tavilyApiKey: process.env.TAVILY_API_KEY,
      includeRawContent,
      topic,
    })
    return await tavilySearch._call({ query })
  },
  {
    name: toolName,
    description: 'Run a web search',
    schema: z.object({
      query: z.string().describe('The search query'),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe('Maximum number of results to return'),
      topic: z
        .enum(['general', 'news', 'finance'])
        .optional()
        .default('general')
        .describe('Search topic category'),
      includeRawContent: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include raw content'),
    }),
  },
)
