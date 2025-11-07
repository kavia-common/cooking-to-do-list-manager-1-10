/**
 * Minimal ESLint config to defer to CRA's built-in configuration during build.
 * This prevents external plugin resolution issues in CI while retaining local linting if desired.
 */
export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        document: true,
        window: true,
        test: true,
        expect: true
      }
    },
    rules: {
      // Keep JSX var usage rule compatible with CRA
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error"
    }
  }
];
