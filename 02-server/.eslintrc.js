module.exports = {
  extends: 'eslint-config-egg/typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'array-bracket-spacing': 'off'
  }
};
