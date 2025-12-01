import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import cypress from 'eslint-plugin-cypress';
import playwright from 'eslint-plugin-playwright';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'coverage-jest/*', 'coverage-cypress/*'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ),
  {
    plugins: {
      react,
      prettier,
      'unused-imports': unusedImports,
      cypress,
      import: importPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        insights: true,
        React: true,
        mount: true, // Set to true to allow it to be used without definition
      },

      parser: babelParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      'arrow-body-style': ['error', 'as-needed'],
      'react/react-in-jsx-scope': 'off',
      camelcase: 'off',
      'spaced-comment': 'error',
      'prettier/prettier': ['warn', { singleQuote: true }],
      'import/no-duplicates': 'error', // This rule provides auto-fix capability
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn'],
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],

      // React-specific rules from the original config
      'react/boolean-prop-naming': 'error',
      'react/no-children-prop': 'error',
      'react/display-name': 'off',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-typos': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-unused-state': 'error',
      'react/prefer-es6-class': 'error',
      'react/prefer-read-only-props': 'error',
      'react/require-render-return': 'error',
      'react/state-in-constructor': 'error',
      'react/style-prop-object': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-handler-names': 'error',
      'react/sort-comp': [
        'error',
        {
          order: ['static-methods', 'lifecycle', 'everything-else', '/^handle.+$/', 'render'],
        },
      ],

      // Code quality rules (not formatting)
      curly: ['error', 'all'],
      'dot-notation': 'error',
      eqeqeq: 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-prototype-builtins': 'off',
      'no-use-before-define': ['error', { functions: false }],
      'no-undef': 'error',
      'no-unused-vars': 'off', // Handled by unused-imports plugin
      'no-var': 'error',
      'no-with': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'vars-on-top': 'error',
      'wrap-iife': 'error',
      yoda: ['error', 'never'],
    },
  },
  {
    // Override for Playwright tests
    files: ['playwright/**/*.ts'],
    plugins: {
      playwright: playwright,
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      ...playwright.configs.recommended.rules,
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-conditional-expect': 'off',
      'playwright/no-nested-step': 'off',
      'playwright/no-skipped-test': [
        'error',
        {
          allowConditional: true,
        },
      ],
    },
  },
];
