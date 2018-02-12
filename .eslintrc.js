module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  extends: "semistandard",
  env: {
    browser: true,
    node: true,
    mocha: true,
    jasmine: true
  },
  // required to lint *.vue files
  plugins: ["html"],
  // check if imports actually resolve
  settings: {
    "import/resolver": {
      webpack: {
        config: `${__dirname}/build/webpack.base.conf.js`
      }
    }
  },
  // add your custom rules here
  rules: {
    "no-console": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "space-before-function-paren": 0,
    "no-trailing-spaces": 0,
    "padded-blocks": 0,
    "prefer-promise-reject-errors": 0,
    "no-multiple-empty-lines": 0,
    "eol-last": 0,
    indent: 0,
    "brace-style": 0,
    "no-extend-native": 0,
    "spaced-comment": 0,
    quotes: 0,
    curly: 0,
    "space-before-blocks": 0
  }
};
