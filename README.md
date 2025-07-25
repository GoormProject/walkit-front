# Walkit Frontend

React + TypeScript + Vite 기반의 Walkit 프로젝트입니다.

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수들을 설정하세요:

```env
# API 설정
VITE_API_BASE_URL= # 백엔드 API 주소값
VITE_API_TIMEOUT= # API 요청시 타임아웃 값 (밀리초)
VITE_APP_TITLE= # 브라우저 탭 제목
VITE_APP_VERSION= # 애플리케이션 버전
VITE_PORT= # 개발서버 포트번호
VITE_HOST= # 개발서버 호스트 (localhost)

# 카카오 맵 API 설정
VITE_KAKAO_MAP_API_KEY= # 카카오 맵 JavaScript API 키

# 인증 시스템 설정 (개발용)
VITE_BYPASS_AUTH= # 인증 우회 설정 (true/false) - 개발 시 인증 없이 접근 가능
VITE_TEST_JWT= # 테스트 JWT 토큰 설정 (true/false) - 개발 시 JWT 토큰 시뮬레이션
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

## 카카오 맵 API 설정

### 1. 카카오 개발자 계정 생성

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 카카오 계정으로 로그인
3. 애플리케이션 생성

### 2. JavaScript API 키 발급

1. 생성된 애플리케이션 선택
2. "플랫폼" → "Web" 플랫폼 등록
3. 사이트 도메인 등록 (개발 시: `http://localhost:5173`)
4. "앱 키" → "JavaScript 키" 복사

### 3. 환경변수 설정

`.env` 파일에 카카오 맵 API 키를 추가하세요:

```env
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key_here
```

**⚠️ 보안 주의사항**: `.env` 파일은 `.gitignore`에 포함되어 있으므로 API 키가 실수로 커밋되지 않습니다.

### 4. 코드에서 API 키 사용

`src/utils/kakaoMap.ts` 파일에서 API 키를 환경변수로 사용하도록 수정:

```typescript
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
```
