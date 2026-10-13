type InferenceProvider = "Ollama" | "Huggingface" | "Requesty" | "Openrouter";

export type SelectedModel = {
  value: string;
  provider?: string;
  inference: InferenceProvider;
  endpoint?: string;
};

export const LIST_OF_MODELS: SelectedModel[] = [
  {
    provider: "Random (first available)",
    value: "openrouter/free",
    inference: "Openrouter",
    endpoint: "https://openrouter.ai/api/v1",
  },
  {
    provider: "Cohere",
    value: "cohere/north-mini-code:free",
    inference: "Openrouter",
    endpoint: "https://openrouter.ai/api/v1",
  },
  // {
  //   provider: "Deepseek",
  //   value: "deepseek-ai/DeepSeek-V4-Flash:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
  {
    provider: "Google",
    value: "gemma4",
    inference: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  {
    provider: "Google",
    value: "gemma-4-31b-it",
    inference: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  // {
  //   provider: "Google",
  //   value: "google/gemma-4-31B-it:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
  // {
  //   provider: "IBM",
  //   value: "ibm-granite/granite-4.2-30b:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
  {
    provider: "InclusionAI",
    value: "inclusionai/ling-3.0-flash:free",
    inference: "Openrouter",
    endpoint: "https://openrouter.ai/api/v1",
  },
  {
    provider: "InclusionAI",
    value: "ling-3.1-flash",
    inference: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    provider: "Meta",
    value: "muse-glimmer-30b",
    inference: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    provider: "NVIDIA",
    value: "nemotron-3-super",
    inference: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  {
    provider: "NVIDIA",
    value: "nemotron-3-super-120b-a12b",
    inference: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    provider: "OpenAI",
    value: "gpt-oss:120b",
    inference: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  // {
  //   provider: "OpenAI",
  //   value: "openai/gpt-oss-120b:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
  // {
  //   provider: "PrismML",
  //   value: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
  // {
  //   provider: "Qwen",
  //   value: "Qwen/Qwen3-32B:cheapest",
  //   inference: "Huggingface",
  //   endpoint: "https://router.huggingface.co/v1",
  // },
];

export const DEFAULT_MODEL: SelectedModel = LIST_OF_MODELS.find(
  (model) => model.value === "openrouter/free",
) as SelectedModel;
