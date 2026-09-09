module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // add new line above return
    'newline-before-return': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'ignore',
        named: 'ignore',
        asyncArrow: 'ignore'
      }
    ],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }]
  }
}
