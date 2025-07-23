# Walkit Frontend

React + TypeScript + Vite 기반의 Walkit 프로젝트입니다.

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수들을 설정하세요:

```env
# API 설정
VITE_API_BASE_URL= # 백엔드 API 주소값
VITE_API_TIMEOUT= # API 요청시 타임아웃 값
VITE_APP_TITLE= # 브라우저 탭 제목
VITE_APP_VERSION=  # 애플리케이션 버전
VITE_PORT= # 개발서버 포트번호
VITE_HOST= # 개발서버 호스트 (localhost)
```

### 환경변수 사용 방법

```typescript
import { env, getApiUrl, getAppInfo } from '@/utils/env';

// 환경변수 직접 사용
console.log(env.API_BASE_URL);

// API URL 생성
const apiUrl = getApiUrl('/api/users');

// 앱 정보 가져오기
const appInfo = getAppInfo();
```

### 환경변수 설명

- `VITE_API_BASE_URL`: API 서버의 기본 URL
- `VITE_API_TIMEOUT`: API 요청 타임아웃 시간 (밀리초)
- `VITE_APP_TITLE`: 애플리케이션 제목
- `VITE_APP_VERSION`: 애플리케이션 버전
- `VITE_PORT`: 개발 서버 포트 번호
- `VITE_HOST`: 개발 서버 호스트

## 설치 및 실행

```bash
# 의존성 설치
npm install

# @types/node 설치 (TypeScript 오류 해결용)
npm install --save-dev @types/node

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```


