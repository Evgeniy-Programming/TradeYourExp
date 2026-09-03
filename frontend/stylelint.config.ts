/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-css-modules',
    'stylelint-config-clean-order',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'font-family-no-missing-generic-family-keyword': true,
    'property-no-unknown': true,
    'unit-no-unknown': true,
    'color-hex-length': 'long',
    'value-keyword-case': 'lower',
    'selector-max-id': 1,
    'selector-class-pattern': null,
    'scss/selector-no-union-class-name': null,
  },
};
