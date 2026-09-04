import type { Interrupt } from "@langchain/langgraph/web";

export type CustomInterrupt = Omit<Interrupt, "value"> & {
  value?: {
    action: string;
    message: string;
  };
};
