import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.node },
	},
	{
		files: ["**/*.{test,spec}.{js,mjs,cjs}"],
		plugins: { jest: pluginJest },
		rules: {
			"jest/no-disabled-tests": "warn",
			"jest/no-focused-tests": "error",
			"jest/no-identical-title": "error",
			"jest/valid-expect": "error",
			"jest/no-jest-import": "off",
			"no-undef": "error",
		},
	},
]);
