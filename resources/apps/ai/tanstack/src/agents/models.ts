import type { SelectableModel } from "#/agents/types";

export const LIST_OF_MODELS: SelectableModel[] = [
  {
    metadata: {
      chef: "Openrouter",
      chefSlug: "openrouter",
      name: "Free Model Router",
      default: true,
    },
    providers: [
      {
        id: "openrouter/free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY!,
      },
    ],
  },
  {
    metadata: { chef: "Cohere", chefSlug: "cohere", name: "North Mini Code" },
    providers: [
      {
        id: "cohere/north-mini-code:free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY!,
      },
    ],
  },
  {
    metadata: {
      chef: "DeepSeek",
      chefSlug: "deepseek",
      name: "DeepSeek V4 Flash",
    },
    providers: [
      {
        id: "@cf/deepseek-ai/deepseek-v4-flash-0731",
        inference: "cloudflare",
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
        apiKey: process.env.CLOUDFLARE_API_KEY!,
      },
      {
        id: "deepseek-ai/DeepSeek-V4-Flash:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
  {
    metadata: { chef: "Google", chefSlug: "google", name: "Gemma 4" },
    providers: [
      {
        id: "@cf/google/gemma-4-26b-a4b-it",
        inference: "cloudflare",
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
        apiKey: process.env.CLOUDFLARE_API_KEY!,
      },
      {
        id: "gemma4",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
        apiKey: process.env.OLLAMA_API_KEY!,
      },
      {
        id: "gemma-4-31b-it",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
        apiKey: process.env.REQUESTY_API_KEY!,
      },
      {
        id: "google/gemma-4-31b-it:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
  {
    metadata: { chef: "IBM", chefSlug: "ibm", name: "Granite 4" },
    providers: [
      {
        id: "@cf/ibm-granite/granite-4.0-h-micro",
        inference: "cloudflare",
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
        apiKey: process.env.CLOUDFLARE_API_KEY!,
      },
      {
        id: "ibm-granite/granite-4.2-30b:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
  {
    metadata: {
      chef: "InclusionAI",
      chefSlug: "inclusionai",
      name: "Ling 3.0/3.1 Flash",
    },
    providers: [
      {
        id: "inclusionai/ling-3.0-flash:free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY!,
      },
      {
        id: "ling-3.1-flash",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
        apiKey: process.env.REQUESTY_API_KEY!,
      },
    ],
  },
  {
    metadata: { chef: "Meta", chefSlug: "meta", name: "Muse Glimmer" },
    providers: [
      {
        id: "muse-glimmer-30b",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
        apiKey: process.env.REQUESTY_API_KEY!,
      },
    ],
  },
  {
    metadata: { chef: "Mistral", chefSlug: "mistral", name: "Leanstral" },
    providers: [
      {
        id: "leanstral-1-5",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
        apiKey: process.env.REQUESTY_API_KEY!,
      },
    ],
  },
  {
    metadata: { chef: "NVIDIA", chefSlug: "nvidia", name: "Nemotron 3 Super" },
    providers: [
      {
        id: "nemotron-3-super",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
        apiKey: process.env.OLLAMA_API_KEY!,
      },
      {
        id: "nemotron-3-super-120b-a12b",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
        apiKey: process.env.REQUESTY_API_KEY!,
      },
    ],
  },
  {
    metadata: {
      chef: "OpenAI",
      chefSlug: "openai",
      name: "GPT OSS",
      default: true,
    },
    providers: [
      {
        id: "@cf/openai/gpt-oss-120b",
        inference: "cloudflare",
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
        apiKey: process.env.CLOUDFLARE_API_KEY!,
      },
      {
        id: "openai/gpt-oss-120b",
        inference: "groq",
        endpoint: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY!,
      },
      {
        id: "gpt-oss:120b",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
        apiKey: process.env.OLLAMA_API_KEY!,
      },
      {
        id: "openai/gpt-oss-120b:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
  {
    metadata: { chef: "PrismML", chefSlug: "prismml", name: "Ternary Bonsai" },
    providers: [
      {
        id: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
  {
    metadata: { chef: "Qwen", chefSlug: "qwen", name: "Qwen3" },
    providers: [
      {
        id: "@cf/qwen/qwen3.8-27b",
        inference: "cloudflare",
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
        apiKey: process.env.CLOUDFLARE_API_KEY!,
      },
      {
        id: "Qwen/Qwen3-32B:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
      },
    ],
  },
];

export const DEFAULT_MODEL: SelectableModel = LIST_OF_MODELS.find(
  ({ metadata }) => metadata.default,
) as SelectableModel;
