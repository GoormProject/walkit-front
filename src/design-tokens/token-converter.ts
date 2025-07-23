 // Figma 디자인 토큰을 CSS 변수로 변환하는 유틸리티

export interface FigmaToken {
    name: string;
    value: string | number;
    type: string;
    description?: string;
  }
  
  export interface DesignTokens {
    colors?: Record<string, FigmaToken>;
    typography?: Record<string, FigmaToken>;
    spacing?: Record<string, FigmaToken>;
    shadows?: Record<string, FigmaToken>;
    borders?: Record<string, FigmaToken>;
  }
  
  /**
   * Figma JSON 토큰을 CSS 변수 문자열로 변환
   */
  export function convertTokensToCSS(tokens: DesignTokens): string {
    let css = ':root {\n';
    
    // 색상 토큰 변환
    if (tokens.colors) {
      css += '  /* ===================================\n     COLOR TOKENS\n     =================================== */\n';
      Object.entries(tokens.colors).forEach(([name, token]) => {
        const cssVarName = `--color-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        css += `  ${cssVarName}: ${token.value};\n`;
      });
      css += '\n';
    }
    
    // 타이포그래피 토큰 변환
    if (tokens.typography) {
      css += '  /* ===================================\n     TYPOGRAPHY TOKENS\n     =================================== */\n';
      Object.entries(tokens.typography).forEach(([name, token]) => {
        const cssVarName = `--font-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        css += `  ${cssVarName}: ${token.value};\n`;
      });
      css += '\n';
    }
    
    // 간격 토큰 변환
    if (tokens.spacing) {
      css += '  /* ===================================\n     SPACING TOKENS\n     =================================== */\n';
      Object.entries(tokens.spacing).forEach(([name, token]) => {
        const cssVarName = `--spacing-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        css += `  ${cssVarName}: ${token.value};\n`;
      });
      css += '\n';
    }
    
    css += '}';
    return css;
  }
  
  /**
   * Figma JSON 토큰을 Tailwind 설정으로 변환
   */
  export function convertTokensToTailwind(tokens: DesignTokens): Record<string, any> {
    const tailwindConfig: Record<string, any> = {};
    
    // 색상 토큰을 Tailwind colors로 변환
    if (tokens.colors) {
      tailwindConfig.colors = {};
      Object.entries(tokens.colors).forEach(([name, token]) => {
        const tailwindName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.colors[tailwindName] = `var(--color-${tailwindName})`;
      });
    }
    
    return tailwindConfig;
  }
