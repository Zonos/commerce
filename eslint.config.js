import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "public/**",
      "coverage/**",
      "*.d.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readable",
        JSX: "readable",
        process: "readable",
        Headers: "readable",
        HeadersInit: "readable",
        Response: "readable",
        Request: "readable",
        RequestInit: "readable",
        Node: "readable",
        URL: "readable",
        console: "readable",
        MouseEvent: "readable",
        HTMLDivElement: "readable",
        URLSearchParams: "readable",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      next: {
        rootDir: ".",
      },
    },
    rules: {
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      // TypeScript rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // React rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off", // Not needed with React 17+

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // Next.js rules
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",

      // General rules
      "no-undef": "error",
      "no-useless-catch": "warn",
      "no-redeclare": "warn",
    },
  },
];
