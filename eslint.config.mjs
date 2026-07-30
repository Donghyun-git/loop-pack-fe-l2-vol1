import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

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
    // Generated/build artifacts & cache
    "coverage/**",
    ".eslintcache",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
      "no-console": ["error", { allow: ["error"] }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  // FSD 의존성 하네스.
  // 의존 방향: app → _pages → widgets → features → entities → shared
  // src/app 은 Next 라우팅 디렉터리이지만 의존 순서상 최상위라 app 타입으로 잡는다.
  //
  // configs.recommended 를 깔고 시작한다. 이 preset 은 no-unknown-files /
  // no-unknown-dependencies / no-ignored-dependencies 를 끈 상태로 두어,
  // 프로젝트 일부가 아직 규칙을 안 지켜도 점진적으로 리팩토링할 수 있게 한다.
  // 즉 아직 안 옮긴 폴더(api/ services/ store/ types/ utils/ lib/ components/)는
  // 어떤 element 에도 안 잡혀 규칙이 적용되지 않는다. 레이어가 이사 오는 즉시 검증이 시작된다.
  //
  // 마이그레이션(S7)이 끝나면 configs.strict 로 올린다. strict 는 위 세 규칙을 켜므로
  // "옮기기를 빠뜨린 파일"이 no-unknown-files 로 기계적으로 드러난다.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    // recommended 의 settings 는 elements 가 빈 배열이다. 여기서 실제 정의로 덮는다.
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "pages", pattern: "src/_pages/*", capture: ["slice"] },
        { type: "widgets", pattern: "src/widgets/*", capture: ["slice"] },
        { type: "features", pattern: "src/features/*", capture: ["slice"] },
        { type: "entities", pattern: "src/entities/*", capture: ["slice"] },
        { type: "shared", pattern: "src/shared" },
      ],
    },
    rules: {
      // rules 객체는 통째로 교체되므로 recommended 의 off 설정을 명시적으로 병합한다.
      // (spread 를 빼면 no-unknown-* 가 preset 기본값으로 되살아나 마이그레이션 중 에러가 쏟아진다)
      ...boundaries.configs.recommended.rules,
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          message: "FSD 의존 방향 위반: {{from.type}} → {{to.type}}",
          policies: [
            // 규칙 ① 하위 레이어만 import 한다 (app → _pages → widgets → features → entities → shared)
            {
              from: { element: { type: "app" } },
              allow: {
                to: { element: { types: { anyOf: ["app", "pages", "widgets", "features", "entities", "shared"] } } },
              },
            },
            {
              from: { element: { type: "pages" } },
              allow: { to: { element: { types: { anyOf: ["widgets", "features", "entities", "shared"] } } } },
            },
            {
              from: { element: { type: "widgets" } },
              allow: { to: { element: { types: { anyOf: ["features", "entities", "shared"] } } } },
            },
            {
              from: { element: { type: "features" } },
              allow: { to: { element: { types: { anyOf: ["entities", "shared"] } } } },
            },
            {
              from: { element: { type: "entities" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "shared" } } },
            },
            // 규칙 ② 같은 레이어에서는 자기 슬라이스만 import 한다.
            // captured.slice 가 from 쪽 slice 와 같을 때만 허용 → 형제 슬라이스는 걸린다.
            {
              from: { element: { type: "pages" } },
              allow: { to: { element: { type: "pages", captured: { slice: "{{from.slice}}" } } } },
            },
            {
              from: { element: { type: "widgets" } },
              allow: { to: { element: { type: "widgets", captured: { slice: "{{from.slice}}" } } } },
            },
            {
              from: { element: { type: "features" } },
              allow: { to: { element: { type: "features", captured: { slice: "{{from.slice}}" } } } },
            },
            {
              from: { element: { type: "entities" } },
              allow: { to: { element: { type: "entities", captured: { slice: "{{from.slice}}" } } } },
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
