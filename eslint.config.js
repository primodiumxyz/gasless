import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
  languageOptions: {
    parserOptions: {
      project: ["./packages/*/tsconfig.json"],
    },
  },
  rules: {
    "@typescript-eslint/require-await": "off",
  },
  ignores: ["**/dist/**", "vite.config.ts"],
});
