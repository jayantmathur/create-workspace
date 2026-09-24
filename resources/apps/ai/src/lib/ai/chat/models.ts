export const LIST_OF_MODELS: Record<
  string,
  {
    label: string;
    value: string;
  }[]
> = {
  Openrouter: [
    { label: "Random (first available)", value: "openrouter/free" },
    { label: "NVIDIA", value: "nvidia/nemotron-3.5-lightning:free" },
    { label: "Zai", value: "z-ai/glm-5.2:free" },
    { label: "MiniMax", value: "minimax/minimax-m3:free" },
    { label: "InclusionAI", value: "inclusionai/ling-3.0-flash:free" },
    { label: "Cohere", value: "cohere/north-mini-code:free" },
  ],
  Huggingface: [
    { label: "OpenAI", value: "openai/gpt-oss-120b:deepinfra" },
    { label: "Google", value: "google/gemma-4-31B-it:preferred" },
    { label: "IBM", value: "ibm-granite/granite-4.2-30b:preferred" },
    {
      label: "Deepseek",
      value: "deepseek-ai/DeepSeek-V4-Flash-0731:deepinfra",
    },
    { label: "Qwen", value: "Qwen/Qwen3-32B:preferred" },
    {
      label: "PrismML",
      value: "prism-ml/Ternary-Bonsai-27B-AWQ-4bit:together",
    },
  ],
};
