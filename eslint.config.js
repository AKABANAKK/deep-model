module.exports = [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parser: require("@typescript-eslint/parser"),
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            "no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
            "semi": ["error", "always"],
            "quotes": ["error", "single"],
            "@typescript-eslint/no-explicit-any": "warn",
            "eqeqeq": ["error", "always"]
        }
    }
];
