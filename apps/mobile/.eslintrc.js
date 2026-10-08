module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native-a11y', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native-a11y/all'
  ],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message: "Do not use hex color literals. Use theme tokens from useTheme() instead.",
      }
    ],
    'react-native-a11y/has-accessibility-props': 'error',
    'react/jsx-no-literals': 'error',
  },
};
