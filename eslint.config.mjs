import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 이 저장소에서 추가로 무시하는 것 — 검사 대상이 아닌 산출물·캐시
    ".qa/**",
    "scripts/.cache/**",
  ]),
]);

export default eslintConfig;
