import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "@tanstack/query": require("@tanstack/eslint-plugin-query"),
    },
    rules: {
      // Enable recommended rules for TanStack Query
      ...require("@tanstack/eslint-plugin-query").configs.recommended.rules,
    },
  },
];

export default eslintConfig;
