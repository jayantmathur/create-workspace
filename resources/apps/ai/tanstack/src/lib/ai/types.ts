type InferenceSource = "openrouter" | "ollama" | "huggingface" | "requesty";

type AIProvider = {
  id: string;
  inference: InferenceSource;
  endpoint: string;
};

export type ModelMetadata = {
  chef: string;
  chefSlug: string;
  name: string;
};

export type SelectableModel = {
  metadata: ModelMetadata;
  providers: AIProvider[];
};

export const REASONING_EFFORTS = [
  // "off",
  "minimal",
  "low",
  "medium",
  "high",
  // "xhigh",
  // "max",
] as const;

export type ReasoningEffort = (typeof REASONING_EFFORTS)[number];
