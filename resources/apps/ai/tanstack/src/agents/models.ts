import type { SelectableModel } from "#/agents/types";

export const LIST_OF_MODELS: SelectableModel[] = [
  {
    metadata: {
      chef: "Openrouter",
      chefSlug: "openrouter",
      name: "Free Model Router",
      // default: true,
    },
    providers: [
      {
        id: "openrouter/free",
        inference: "openrouter",
      },
    ],
  },
  {
    metadata: { chef: "Cohere", chefSlug: "cohere", name: "North Mini Code" },
    providers: [
      {
        id: "cohere/north-mini-code:free",
        inference: "openrouter",
      },
    ],
  },
  {
    metadata: {
      chef: "SwissAI",
      chefSlug: "swiss-ai",
      name: "Apertus V1.5",
    },
    providers: [
      {
        id: "@cf/swiss-ai/apertus-v1.5-8b",
        inference: "cloudflare",
      },
    ],
  },
  // {
  //   metadata: {
  //     chef: "DeepSeek",
  //     chefSlug: "deepseek",
  //     name: "DeepSeek V4 Flash",
  //   },
  //   providers: [
  //     {
  //       id: "@cf/deepseek-ai/deepseek-v4-flash-0731",
  //       inference: "cloudflare",
  //     },
  //     {
  //       id: "deepseek-ai/DeepSeek-V4-Flash:cheapest",
  //       inference: "huggingface",
  //     },
  //   ],
  // },
  {
    metadata: { chef: "Google", chefSlug: "google", name: "Gemma 4" },
    providers: [
      {
        id: "@cf/google/gemma-4-26b-a4b-it",
        inference: "cloudflare",
      },
      {
        id: "gemma-4-31b-it",
        inference: "requesty",
      },
      {
        id: "gemma4",
        inference: "ollama",
      },
      {
        id: "google/gemma-4-31b-it:cheapest",
        inference: "huggingface",
      },
    ],
  },
  {
    metadata: { chef: "IBM", chefSlug: "ibm", name: "Granite 4" },
    providers: [
      {
        id: "@cf/ibm-granite/granite-4.0-h-micro",
        inference: "cloudflare",
      },
      {
        id: "ibm-granite/granite-4.2-30b:cheapest",
        inference: "huggingface",
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
      },
      {
        id: "ling-3.1-flash",
        inference: "requesty",
      },
    ],
  },
  // {
  //   metadata: { chef: "Meta", chefSlug: "meta", name: "Muse Glimmer" },
  //   providers: [
  //     {
  //       id: "muse-glimmer-30b",
  //       inference: "requesty",
  //     },
  //   ],
  // },
  {
    metadata: { chef: "Mistral", chefSlug: "mistral", name: "Leanstral" },
    providers: [
      {
        id: "leanstral-1-5",
        inference: "requesty",
      },
    ],
  },
  {
    metadata: {
      chef: "NVIDIA",
      chefSlug: "nvidia",
      name: "Nemotron 3.5 Lightning",
    },
    providers: [
      {
        id: "nemotron-3.5-lightning-30b-a3b",
        inference: "requesty",
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
      },
      {
        id: "openai/gpt-oss-120b",
        inference: "groq",
      },
      {
        id: "gpt-oss:120b",
        inference: "ollama",
      },
      {
        id: "openai/gpt-oss-120b:cheapest",
        inference: "huggingface",
      },
    ],
  },
  // {
  //   metadata: { chef: "PrismML", chefSlug: "prismml", name: "Ternary Bonsai" },
  //   providers: [
  //     {
  //       id: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:cheapest",
  //       inference: "huggingface",
  //     },
  //   ],
  // },
  {
    metadata: { chef: "Qwen", chefSlug: "qwen", name: "Qwen3" },
    providers: [
      {
        id: "@cf/qwen/qwen3.8-27b",
        inference: "cloudflare",
      },
      {
        id: "Qwen/Qwen3-32B:cheapest",
        inference: "huggingface",
      },
    ],
  },
];

export const DEFAULT_MODEL: SelectableModel = LIST_OF_MODELS.find(
  ({ metadata }) => metadata.default,
) as SelectableModel;
