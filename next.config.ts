import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // gera ./out estático (serve no Live Server)
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
