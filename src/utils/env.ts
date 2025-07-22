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

// 환경변수 검증 함수
const validateEnvVar = (name: string, value: string | undefined, isRequired: boolean = true): string => {
  if (isRequired && (!value || value.trim() === '')) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다. .env 파일에 ${name}을 설정해주세요.`);
  }
  return value || '';
};

const validateNumberEnvVar = (name: string, value: string | undefined, isRequired: boolean = true): number => {
  if (isRequired && (!value || value.trim() === '')) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다. .env 파일에 ${name}을 설정해주세요.`);
  }
  const num = parseInt(value || '0');
  if (isRequired && isNaN(num)) {
    throw new Error(`${name} 환경변수가 유효한 숫자가 아닙니다. .env 파일에 ${name}을 올바른 숫자로 설정해주세요.`);
  }
  return num;
};

// 환경변수 검증 및 설정
export const env: EnvConfig = {
  API_BASE_URL: validateEnvVar('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  API_TIMEOUT: validateNumberEnvVar('VITE_API_TIMEOUT', import.meta.env.VITE_API_TIMEOUT),
  APP_TITLE: validateEnvVar('VITE_APP_TITLE', import.meta.env.VITE_APP_TITLE),
  APP_VERSION: validateEnvVar('VITE_APP_VERSION', import.meta.env.VITE_APP_VERSION),
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  PORT: validateNumberEnvVar('VITE_PORT', import.meta.env.VITE_PORT),
  HOST: validateEnvVar('VITE_HOST', import.meta.env.VITE_HOST),
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