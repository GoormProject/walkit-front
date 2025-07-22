import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 환경변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // 환경변수를 클라이언트에서 사용할 수 있도록 설정
    define: {
      __APP_VERSION__: JSON.stringify((() => {
        if (!env.VITE_APP_VERSION) {
          throw new Error('VITE_APP_VERSION 환경변수가 설정되지 않았습니다. .env 파일에 VITE_APP_VERSION을 설정해주세요.');
        }
        return env.VITE_APP_VERSION;
      })()),
    },
    
    // 환경변수 접근을 위한 설정
    envPrefix: 'VITE_',
    
    // 개발 서버 설정
    server: {
      port: (() => {
        const port = parseInt(env.VITE_PORT);
        if (!env.VITE_PORT || isNaN(port)) {
          throw new Error('VITE_PORT 환경변수가 설정되지 않았거나 유효하지 않습니다. .env 파일에 VITE_PORT를 설정해주세요.');
        }
        return port;
      })(),
      host: (() => {
        if (!env.VITE_HOST) {
          throw new Error('VITE_HOST 환경변수가 설정되지 않았습니다. .env 파일에 VITE_HOST를 설정해주세요.');
        }
        return env.VITE_HOST;
      })(),
    },
    
    // 빌드 설정
    build: {
      outDir: 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true',
    },
    
    // 경로 별칭 설정
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
