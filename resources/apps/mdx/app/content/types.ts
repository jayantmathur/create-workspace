import { ImageProps } from "next/image";

type Metadata = {
  name: string;
  description: string;
  keywords: string[];
  image: ImageProps;
  date: string;
};

type MDXImport = typeof import("*.mdx") & {
  metadata: Partial<Metadata>;
};

type Blog = {
  content: typeof import("*.mdx").default;
  metadata: Metadata;
  slug: string;
};

export type { MDXImport, Metadata, Blog };
