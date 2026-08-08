export default {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
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
  },
};
