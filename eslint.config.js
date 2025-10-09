import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Warns about components that are not memoized when they should be.
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Warns about unused variables, helping to keep the codebase clean and reduce bundle size.
      "@typescript-eslint/no-unused-vars": "warn",
      // Disables the requirement for explicit function return types, allowing for type inference.
      "@typescript-eslint/explicit-function-return-type": "off",
      // Warns about the use of 'any' type, encouraging more specific typing for better type safety.
      "@typescript-eslint/no-explicit-any": "warn",
      // Ensures that all dependencies are correctly specified in useEffect, useCallback, etc. hooks.
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);
