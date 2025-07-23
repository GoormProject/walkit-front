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
    const tailwindConfig: Record<string, any> = {
      theme: { extend: {} }
    };
    
    // 색상 토큰을 Tailwind colors로 변환
    if (tokens.colors) {
      tailwindConfig.theme.extend.colors = {};
      Object.entries(tokens.colors).forEach(([name, token]) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.theme.extend.colors[key] = `var(--color-${key})`;
      });
    }
    
    // 스페이싱 토큰을 Tailwind spacing으로 변환
    if (tokens.spacing) {
      tailwindConfig.theme.extend.spacing = {};
      Object.entries(tokens.spacing).forEach(([name, token]) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.theme.extend.spacing[key] = `var(--spacing-${key})`;
      });
    }
    
    // 타이포그래피 토큰을 Tailwind fontSize로 변환
    if (tokens.typography) {
      tailwindConfig.theme.extend.fontSize = {};
      Object.entries(tokens.typography).forEach(([name, token]) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.theme.extend.fontSize[key] = `var(--font-${key})`;
      });
    }
    
    // 쉐도우 토큰을 Tailwind boxShadow로 변환
    if (tokens.shadows) {
      tailwindConfig.theme.extend.boxShadow = {};
      Object.entries(tokens.shadows).forEach(([name, token]) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.theme.extend.boxShadow[key] = `var(--shadow-${key})`;
      });
    }
    
    // 보더 토큰을 Tailwind borderWidth로 변환
    if (tokens.borders) {
      tailwindConfig.theme.extend.borderWidth = {};
      Object.entries(tokens.borders).forEach(([name, token]) => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        tailwindConfig.theme.extend.borderWidth[key] = `var(--border-${key})`;
      });
    }
    
    return tailwindConfig;
  }
