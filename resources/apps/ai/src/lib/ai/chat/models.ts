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
    { label: "LiquidAI", value: "liquid/lfm-2.5-2.6b:free" },
    { label: "Cohere", value: "cohere/north-mini-code:free" },
    { label: "GLM", value: "z-ai/glm-5.2:free" },
    { label: "InclusionAI", value: "inclusionai/ling-3.0-flash-fin:free" },
    { label: "MiniMax", value: "minimax/minimax-m3:free" },
  ],
  Huggingface: [
    { label: "OpenAI", value: "openai/gpt-oss-120b:preferred" },
    { label: "Google", value: "google/gemma-4-31B-it:preferred" },
    { label: "IBM", value: "ibm-granite/granite-4.2-30b:preferred" },
    { label: "Moonshot AI", value: "moonshotai/Kimi-K3:preferred" },
  ],
};
