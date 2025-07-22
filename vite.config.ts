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
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
    },
    
    // 환경변수 접근을 위한 설정
    envPrefix: 'VITE_',
    
    // 개발 서버 설정
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      host: env.VITE_HOST || 'localhost',
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
