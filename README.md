<div align="center">
  
# **Walkit API 프론트엔드**

<img width="120" height="120" alt="walkit logo" src="https://github.com/user-attachments/assets/8a2fcd21-deee-4cf8-913d-b474db1b4cab" />

<br/>
<br/>

    소셜 위치 기반 산책 플랫폼

</div>
<br>

## 프로젝트 개요

**프로젝트 목표** : 사용자의 위치 기반 데이터를 활용하여 산책 경로 탐색, 기록, 공유, 추천까지 통합 제공하는 소셜 산책 플랫폼 개발

<br/>

## 주요 기능

- 🗺️ 산책로 정보 제공
- 📡 산책 기록 기능 및 산책 코스 저장
- 👥 친구 관리 및 위치 공유
- 🌦️ 주변 날씨 조회
- 👕 날씨 맞춤 옷차림 추천
- 🔐 구글/카카오 OAuth2 로그인
- ☁️ AWS 배포
  <br/>
  <br/>

# 기술 스택

- **Frontend**: React, Typescript, Vite, Zustand, Tailwind CSS, Radix-ui, StoryBook, Lucide-icon
- **Authentication** : OAuth2, JWT
- **CI/CD**: Github Actions
- **Infra & Deployment**: AWS, Docker

# 링크

### 백엔드

[walkit-server](https://github.com/GoormProject/walkit-server)

# 팀원

송준경 [@chk-jk](https://github.com/chk-jk)

김보근 [@Bogeun-Kim](https://github.com/Bogeun-Kim)

석진용 [@currysoda](https://github.com/currysoda)

이우창 [@changi1122](https://github.com/changi1122)

한상희 [@sanghee00](https://github.com/sanghee00)

# Walkit Frontend

React + TypeScript + Vite 기반의 Walkit 프로젝트입니다.

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수들을 설정하세요:

```env
# API 설정
VITE_API_BASE_URL= # 백엔드 API 주소값 (필수)
VITE_API_TIMEOUT= # API 요청시 타임아웃 값
VITE_APP_TITLE= # 브라우저 탭 제목
VITE_APP_VERSION=  # 애플리케이션 버전
VITE_PORT= # 개발서버 포트번호
VITE_HOST= # 개발서버 호스트 (localhost)

# 카카오 맵 API 설정
VITE_KAKAO_MAP_API_KEY= # 카카오 맵 JavaScript API 키

# OAuth 설정
VITE_OAUTH_REDIRECT_URL= # OAuth 콜백 URL (선택사항, 현재 코드에서는 직접 사용하지 않음. 백엔드에서 필요할 때만 설정)
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

- `VITE_API_BASE_URL`: API 서버의 기본 URL (필수)
- `VITE_API_TIMEOUT`: API 요청 타임아웃 시간 (밀리초)
- `VITE_APP_TITLE`: 애플리케이션 제목
- `VITE_APP_VERSION`: 애플리케이션 버전
- `VITE_PORT`: 개발 서버 포트 번호
- `VITE_HOST`: 개발 서버 호스트
- `VITE_KAKAO_MAP_API_KEY`: 카카오 맵 JavaScript API 키
- `VITE_OAUTH_REDIRECT_URL`: OAuth 콜백 URL (선택사항, 현재 코드에서는 직접 사용하지 않음. 백엔드에서 필요할 때만 설정)

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

## OAuth 설정

### 1. 필수 환경 변수 설정

OAuth 로그인을 사용하려면 반드시 `.env` 파일에 다음을 설정해야 합니다:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2. OAuth 콜백 URL 설정 (선택사항)

백엔드에서 특정 콜백 URL을 요구하는 경우:

```env
VITE_OAUTH_REDIRECT_URL=http://localhost:5173/oauth/callback
```

### 3. OAuth 로그인 플로우

1. **로그인/회원가입 버튼 클릭**
2. **OAuth 제공자로 리다이렉트** (Google/Kakao)
3. **사용자 인증 완료**
4. **콜백 처리** (`/oauth/callback`)
5. **사용자 정보 조회**
6. **프로필 설정 여부에 따른 리다이렉트**

### 4. 코드에서 API 키 사용

`src/utils/kakaoMap.ts` 파일에서 API 키를 환경변수로 사용하도록 수정:

```typescript
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
```
