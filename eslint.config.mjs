import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        ignores: ["dist/", "webpack.*.js"],
    },
    {
        files: ["src/**/*.js"],
        rules: {
            semi: "error",
            "prefer-const": "error",
        },
    },
];
