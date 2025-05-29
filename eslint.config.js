// eslint.config.mjs
import eslint from "@eslint/js"
import tsEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import globals from "globals"

// Filter out globals with whitespace issues
const cleanBrowserGlobals = Object.fromEntries(
    Object.entries(globals.browser).filter(([key]) => !key.endsWith(" ") && !key.startsWith(" "))
)

export default [
    // Base ESLint recommended config
    eslint.configs.recommended,

    // Browser environment globals (cleaned)
    {
        languageOptions: {
            globals: {
                ...cleanBrowserGlobals,
                ...globals.node,
            },
        },
    },

    // TypeScript configuration
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsEslint,
        },
        rules: {
            ...tsEslint.configs.recommended.rules,
            // Add custom TypeScript rules here
        },
    },

    // Global ignores
    {
        ignores: ["dist", "node_modules", "**/*.d.ts"],
    },
]
