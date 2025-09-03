import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // TypeScript related rules - make them more permissive
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "@typescript-eslint/type-annotation-spacing": "off",
      
      // General rules - make them more permissive
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-alert": "off",
      "prefer-const": "warn",
      "no-var": "warn",
      
      // React related rules - make them more permissive
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      
      // Next.js related rules - make them more permissive
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // Import rules - make them more permissive
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/default": "off",
      "import/namespace": "off",
    },
  },
];

export default eslintConfig;
