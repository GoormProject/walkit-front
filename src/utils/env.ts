// 환경변수 타입 정의
interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  APP_TITLE: string;
  APP_VERSION: string;
  DEBUG_MODE: boolean;
  PORT: number;
  HOST: string;
  SOURCEMAP: boolean;
}

// 환경변수 검증 및 기본값 설정
export const env: EnvConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '5000'),
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Walkit',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  PORT: parseInt(import.meta.env.VITE_PORT || '5173'),
  HOST: import.meta.env.VITE_HOST || 'localhost',
  SOURCEMAP: import.meta.env.VITE_SOURCEMAP === 'true',
};

// 개발 환경 확인
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// 환경변수 사용 예시
export const getApiUrl = (endpoint: string): string => {
  return `${env.API_BASE_URL}${endpoint}`;
};

export const getAppInfo = () => {
  return {
    title: env.APP_TITLE,
    version: env.APP_VERSION,
    debug: env.DEBUG_MODE,
  };
}; 