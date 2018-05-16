const isProduction = process.env.NODE_ENV === 'production';
const off = 0;
const warn = 1;
const error = 2;

module.exports = {
  extends: ['airbnb-base', 'plugin:import/errors', 'plugin:import/warnings'],
  plugins: ['import'],
  env: {
    es6: true,
    node: true,
    browser: false,
  },
  rules: {
    'comma-dangle': [
      error,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline',
      },
    ],
    'function-paren-newline': [error, 'consistent'],
    indent: off,
    'no-console': isProduction ? error : off,
    'no-empty': [error, { allowEmptyCatch: true }],
    'no-implicit-coercion': error,
    'no-multiple-empty-lines': [error, { max: error, maxEOF: error }],
    'no-shadow': off,
    'no-underscore-dangle': off,
    'no-unused-vars': [error, { args: 'after-used', ignoreRestSiblings: false }],
    'object-curly-newline': [error, { consistent: true }],
    'prefer-spread': off,
  },
  parser: 'babel-eslint',
};
