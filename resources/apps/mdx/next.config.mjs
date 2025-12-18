/** @type {import('next').NextConfig} */

const withMDX = require("@next/mdx")();

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
  },
};

export default withMDX(nextConfig);
