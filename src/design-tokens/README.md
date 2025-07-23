# Design Tokens

이 디렉토리는 Figma에서 내보낸 디자인 토큰 JSON 파일들을 저장합니다.

## 📁 파일 구조

```
src/design-tokens/
├── figma-tokens.json        # Figma에서 내보낸 원본 JSON
├── processed-tokens.json    # 가공된 토큰 데이터
├── token-converter.ts       # JSON → CSS 변환 유틸리티
└── README.md               # 이 파일
```

## 🚀 사용 방법

### 1. Figma JSON 파일 추가
Figma에서 내보낸 디자인 토큰 JSON 파일을 `figma-tokens.json`으로 저장

### 2. CSS 변수로 변환
```typescript
import { convertTokensToCSS } from './design-tokens/token-converter';
import figmaTokens from './design-tokens/figma-tokens.json';

const cssVariables = convertTokensToCSS(figmaTokens);
// CSS 파일에 저장하거나 동적으로 적용
```

### 3. Tailwind 설정으로 변환
```typescript
import { convertTokensToTailwind } from './design-tokens/token-converter';
import figmaTokens from './design-tokens/figma-tokens.json';

const tailwindConfig = convertTokensToTailwind(figmaTokens);
// tailwind.config.js에 적용
```

## 📝 예시 JSON 구조

```json
{
  "colors": {
    "primary-500": {
      "name": "Primary 500",
      "value": "#3B82F6",
      "type": "color",
      "description": "메인 브랜드 색상"
    }
  },
  "typography": {
    "font-size-base": {
      "name": "Font Size Base",
      "value": "1rem",
      "type": "typography",
      "description": "기본 폰트 크기"
    }
  },
  "spacing": {
    "spacing-md": {
      "name": "Spacing Medium",
      "value": "1rem",
      "type": "spacing",
      "description": "중간 간격"
    }
  }
}
```

## 🔄 자동화

빌드 시 자동으로 JSON을 CSS 변수로 변환하려면:

1. `package.json`에 스크립트 추가
2. Vite 플러그인으로 빌드 시 자동 변환
3. Storybook과 연동하여 토큰 미리보기

## 📚 참고 자료

- [Figma Design Tokens Plugin](https://www.figma.com/community/plugin/843461159747178978/Design-Tokens)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Design Tokens W3C Specification](https://www.w3.org/TR/design-tokens/) 
