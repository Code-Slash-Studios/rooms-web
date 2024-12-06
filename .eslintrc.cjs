module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: "@babel/eslint-parser" },
    settings: { react: { version: '18.3.1' } },
    rules: {
      'no-unused-vars':['warn'],
      'react/jsx-key':['warn'],
      'react/no-unescaped-entities':['warn'],
      'react/prop-types':['warn'],
      'no-undef':['warn']
    },
  }