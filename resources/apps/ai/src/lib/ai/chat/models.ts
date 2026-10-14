import type { ModelSelectorLogoProps } from "#/components/ai-elements/model-selector";

export type SelectedModel = {
  chef: string;
  chefSlug: string;
  name: string;
  providers: {
    id: string;
    inference: ModelSelectorLogoProps["provider"];
    endpoint: string;
  }[];
};

export const LIST_OF_MODELS: SelectedModel[] = [
  {
    chef: "Openrouter",
    chefSlug: "openrouter",
    name: "Free Model Router",
    providers: [
      {
        id: "openrouter/free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
      },
    ],
  },
  {
    chef: "Cohere",
    chefSlug: "cohere",
    name: "North Mini Code",
    providers: [
      {
        id: "cohere/north-mini-code:free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
      },
    ],
  },
  {
    chef: "DeepSeek",
    chefSlug: "deepseek",
    name: "DeepSeek V4 Flash",
    providers: [
      {
        id: "deepseek-ai/DeepSeek-V4-Flash:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
  {
    chef: "Google",
    chefSlug: "google",
    name: "Gemma 4",
    providers: [
      {
        id: "gemma4",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
      },
      {
        id: "gemma-4-31b-it",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
      },
      {
        id: "google/gemma-4-31b-it:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
  {
    chef: "IBM",
    chefSlug: "ibm",
    name: "Granite 4.2",
    providers: [
      {
        id: "ibm-granite/granite-4.2-30b:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
  {
    chef: "InclusionAI",
    chefSlug: "inclusionai",
    name: "Ling 3.0/3.1 Flash",
    providers: [
      {
        id: "inclusionai/ling-3.0-flash:free",
        inference: "openrouter",
        endpoint: "https://openrouter.ai/api/v1",
      },
      {
        id: "ling-3.1-flash",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
      },
    ],
  },
  {
    chef: "Meta",
    chefSlug: "meta",
    name: "Muse Glimmer",
    providers: [
      {
        id: "muse-glimmer-30b",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
      },
    ],
  },
  {
    chef: "NVIDIA",
    chefSlug: "nvidia",
    name: "Nemotron 3 Super",
    providers: [
      {
        id: "nemotron-3-super",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
      },
      {
        id: "nemotron-3-super-120b-a12b",
        inference: "requesty",
        endpoint: "https://router.requesty.ai/v1",
      },
    ],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    name: "GPT OSS",
    providers: [
      {
        id: "gpt-oss:120b",
        inference: "ollama",
        endpoint: "https://ollama.com/v1",
      },
      {
        id: "openai/gpt-oss-120b:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
  {
    chef: "PrismML",
    chefSlug: "prismml",
    name: "Ternary Bonsai",
    providers: [
      {
        id: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
  {
    chef: "Qwen",
    chefSlug: "qwen",
    name: "Qwen3",
    providers: [
      {
        id: "Qwen/Qwen3-32B:cheapest",
        inference: "huggingface",
        endpoint: "https://router.huggingface.co/v1",
      },
    ],
  },
];

export const DEFAULT_MODEL: SelectedModel = LIST_OF_MODELS.find(
  (model) => model.name === "GPT OSS",
)!;
