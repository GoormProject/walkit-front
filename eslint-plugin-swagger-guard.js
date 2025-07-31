// 커스텀 ESLint 플러그인: /swagger/* 경로 감지
export default {
  rules: {
    'no-swagger-paths': {
      create(context) {
        return {
          Literal(node) {
            if (
              typeof node.value === 'string' &&
              node.value.startsWith('/swagger/')
            ) {
              context.report({
                node,
                message:
                  '문서용 API 경로(/swagger/*)는 실제 요청하면 안 됩니다. 실제 OAuth 엔드포인트를 사용하세요.',
              });
            }
          },
          TemplateElement(node) {
            if (node.value.raw && node.value.raw.includes('/swagger/')) {
              context.report({
                node,
                message:
                  '문서용 API 경로(/swagger/*)는 실제 요청하면 안 됩니다. 실제 OAuth 엔드포인트를 사용하세요.',
              });
            }
          },
        };
      },
    },
  },
};
