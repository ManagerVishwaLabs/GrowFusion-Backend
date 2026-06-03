import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  prettierConfig,

  {
    files: ["**/*.{ts,js}"],

    plugins: {
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
    
      "prettier/prettier": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "sort-imports": [
        "warn",
        {
          ignoreDeclarationSort: true,
        },
      ],

      "no-console": "off",
    },
  },
]);
