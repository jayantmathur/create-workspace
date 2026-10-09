export type SelectedModel = {
  label: string;
  value: string;
  provider: string;
  endpoint?: string;
};

export const LIST_OF_MODELS: SelectedModel[] = [
  {
    label: "Random (first available)",
    value: "openrouter/free",
    provider: "Openrouter",
  },
  {
    label: "Cohere",
    value: "cohere/north-mini-code:free",
    provider: "Openrouter",
  },
  {
    label: "Deepseek",
    value: "deepseek-ai/DeepSeek-V4-Flash:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "Google",
    value: "gemma4",
    provider: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  {
    label: "Google",
    value: "gemma-4-31b-it",
    provider: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    label: "Google",
    value: "google/gemma-4-31B-it:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "IBM",
    value: "ibm-granite/granite-4.2-30b:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "InclusionAI",
    value: "inclusionai/ling-3.0-flash:free",
    provider: "Openrouter",
  },
  {
    label: "InclusionAI",
    value: "ling-3.1-flash",
    provider: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    label: "Meta",
    value: "muse-glimmer-30b",
    provider: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    label: "NVIDIA",
    value: "nemotron-3-super",
    provider: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  {
    label: "NVIDIA",
    value: "nemotron-3-super-120b-a12b",
    provider: "Requesty",
    endpoint: "https://router.requesty.ai/v1",
  },
  {
    label: "OpenAI",
    value: "gpt-oss:120b",
    provider: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
  {
    label: "OpenAI",
    value: "openai/gpt-oss-120b:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "PrismML",
    value: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "Qwen",
    value: "Qwen/Qwen3-32B:cheapest",
    provider: "Huggingface",
    endpoint: "https://router.huggingface.co/v1",
  },
  {
    label: "Z.ai",
    value: "glm-5.3-flash",
    provider: "Ollama",
    endpoint: "https://ollama.com/v1",
  },
];

export const DEFAULT_MODEL: SelectedModel = LIST_OF_MODELS.find(
  (model) => model.provider === "Ollama" && model.label === "OpenAI",
) as SelectedModel;
