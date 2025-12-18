import { MDXImport, Blog } from "../types";
import { readdir } from "fs/promises";
import { resolve } from "path";

const path = resolve(process.cwd(), "app/content/posts");

const getAllBlogs = async () =>
  await readdir(path).then((files) =>
    files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", "")),
  );

const getBlog = async (slug: string) => {
  const blog = (await import(`../posts/${slug}.mdx`)) as MDXImport;

  return {
    content: blog.default,
    metadata: blog.metadata,
    slug: slug,
  } as Blog;
};

const getKeywordAcronym = (keyword: string) => {
  const words = keyword.split(" ");

  if (words.length > 1) return words.map((word) => word[0]).join("");
  else return keyword;
};

export { getBlog, getAllBlogs, getKeywordAcronym };
