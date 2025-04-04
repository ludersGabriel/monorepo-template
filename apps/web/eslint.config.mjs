import createConfig from "@corax-monorepo/eslint-config/create-config"
import pluginQuery from "@tanstack/eslint-plugin-query"
import reactCompiler from "eslint-plugin-react-compiler"
import tailwind from "eslint-plugin-tailwindcss"

export default createConfig(
  {
    react: true,
  },
  ...tailwind.configs["flat/recommended"],
  {
    settings: {
      config: "./tailwind.config.js",
      callees: ["cn", "cva"],
    },
    plugins: {
      "@tanstack/query": pluginQuery,
      "react-compiler": reactCompiler,
    },
    rules: {
      "antfu/top-level-function": "off",
      "@tanstack/query/exhaustive-deps": "error",
      "unicorn/filename-case": ["off"],
      "react-compiler/react-compiler": "error",
    },
  },
  {
    ignores: [
      "**/ui/",
    ],
  },
)
