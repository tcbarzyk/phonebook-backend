module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 15,
  },
  rules: {
    'linebreak-style': 'off',
    'no-console': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
  },
  ignorePatterns: [
    'dist/',
  ],
};
