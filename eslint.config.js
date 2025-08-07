// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// 커스텀 플러그인 import
import swaggerGuard from './eslint-plugin-swagger-guard.js';

export default [
  {
    ignores: [
      'dist/**',
      'docs/**',
      'build/**',
      'node_modules/**',
      '*.log',
      '*.tmp',
      '*.temp',
      // 특정 개발자 작업 파일들 (필요시 주석 해제)
      // 'src/pages/other-developer-work/**',
      // 'src/components/experimental/**',
    ],
  },
  ...tseslint.configs.recommended,
  js.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'swagger-guard': swaggerGuard,
    },
    rules: {
      // 커스텀 규칙: /swagger/* 경로 사용 금지
      'swagger-guard/no-swagger-paths': 'error',
    },
  },
  ...storybook.configs['flat/recommended'],
];
