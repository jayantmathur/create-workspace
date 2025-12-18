import type { Option } from "@clack/prompts";

type BumpType = "patch" | "minor" | "major";

type ResponseType = {
  objective: string;
  name: string;
  overwrite: boolean;
  projects?: {
    apps: string[];
    docs: string[];
  };
};

type CLIOptions = {
  [key: string]: (Option<string> & {
    types?: (Option<string> & {
      callback?: (name: string) => string;
    })[];
  })[];
};

type PaddType = {
  type: "app" | "doc";
  folder?: string;
  scripts?: {
    [key: string]: string;
  };
  dependencies?: string[];
  devDependencies?: string[];
  postinstalls?: string[];
  extras: {
    dependencies?: string[];
    devDependencies?: string[];
  };
  destination?: string;
};

export type { BumpType, ResponseType, CLIOptions, PaddType };
