const prettierConfig = require("./prettier.config");

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:prettier/recommended"],

  rules: {
    "no-console": "warn",
    "no-else-return": "error",
    "no-floating-decimal": "error",
    "no-sequences": "error",
    "array-bracket-spacing": "error",
    "computed-property-spacing": ["error", "never"],
    curly: "error",
    "no-lonely-if": "error",
    "no-unneeded-ternary": "error",
    "one-var-declaration-per-line": "error",
    "array-callback-return": "off",
    "prefer-const": "error",
    "import/prefer-default-export": "off",
    "no-unused-expressions": "off",
    "no-prototype-builtins": "off",
    "prettier/prettier": ["error", prettierConfig],
  },
};
