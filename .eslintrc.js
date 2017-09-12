'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'google',
    'cat'
  ],
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      objectLiteralDuplicateProperties: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  plugins: [
    'import'
  ]
};
