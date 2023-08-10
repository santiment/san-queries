module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
    // 'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  globals: {
    SAN: true,
    App: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      globals: {
        SAN: true,
        App: true,
      },
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },

      rules: {
        'css-unused-selector': 'off',
        'svelte/valid-compile': 'off',
      },
    },
  ],

  rules: {
    'css-unused-selector': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
}
