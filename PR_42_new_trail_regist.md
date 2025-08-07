# 🚀 PR #42: 새로운 산책로 등록 및 리뷰 기능 구현

## 📋 개요

이번 PR에서는 사용자가 개인 산책을 공개 산책로로 등록할 수 있는 기능과 등록된 산책로에 리뷰를 남길 수 있는 기능을 구현했습니다.

## ✨ 주요 기능

### 1. 🏔️ 산책로 등록 기능
- **개인 산책 → 공개 산책로 변환**: 업로드되지 않은 개인 산책을 공개 산책로로 등록
- **이미지 업로드**: 산책로를 대표할 이미지 업로드 (JPG, PNG, 최대 5MB)
- **기본 이미지 활용**: DB에 저장된 산책 이미지를 기본값으로 사용
- **FormData 전송**: 이미지와 JSON 데이터를 함께 서버로 전송

### 2. 📝 리뷰 작성 기능
- **등록된 산책로 리뷰**: 다른 사용자가 만든 산책로에 리뷰 작성
- **별점 시스템**: 1-5점 별점 평가
- **리뷰 내용**: 최대 200자 리뷰 텍스트 작성
- **조건부 버튼 표시**: 산책 유형에 따라 적절한 버튼 표시

### 3. 🎯 조건부 버튼 표시 로직
- **개인 산책**: "공유하기" 버튼 표시
- **등록된 산책로**: "리뷰 남기기" 버튼 표시
- **내가 업로드한 산책로**: 향후 API 개선 후 버튼 숨김 예정

## 🛠️ 기술적 개선사항

### 1. 타입 안전성 강화
- `isValidWalkRecord`, `isValidWalkDetail` 타입 가드 추가
- `safeParseInt`, `safeParseFloat` 유틸리티 함수 활용
- 데이터 검증 및 정제 로직 구현

### 2. API 구조 개선
- **새로운 API 엔드포인트**:
  - `POST /api/trails/new`: 산책로 등록
  - `POST /api/reviews`: 리뷰 작성
  - `GET /api/reviews/my/{trailId}`: 내 리뷰 확인 (향후 구현)
  - `GET /api/trails/{trailId}/ownership`: 산책로 소유자 확인 (향후 구현)

### 3. UI/UX 개선
- **반응형 2열 레이아웃**: 데스크톱에서 효율적인 화면 활용
- **이미지 업로드 UI**: 프로필 이미지 업로드 로직 참고하여 구현
- **직관적인 버튼 표시**: 산책 유형에 따른 조건부 버튼 렌더링

## 📁 파일 구조

### 새로 생성된 파일
```
src/
├── pages/
│   ├── trail-register/
│   │   └── index.tsx          # 산책로 등록 페이지
│   └── reviews/
│       └── index.tsx          # 리뷰 작성 페이지
├── types/
│   ├── trail.ts               # 산책로 관련 타입 정의
│   └── review.ts              # 리뷰 관련 타입 정의
└── utils/
    ├── trailApi.ts            # 산책로 API 함수
    └── reviewApi.ts           # 리뷰 API 함수
```

### 수정된 파일
```
src/
├── components/
│   └── WalkHistoryList.tsx    # 조건부 버튼 표시 로직 추가
├── hooks/
│   └── useWalkRecords.ts      # 데이터 검증 로직 추가
├── utils/
│   ├── walkApi.ts             # API 응답 검증 개선
│   ├── walkUtils.ts           # 데이터 검증/정제 함수 추가
│   └── mockWalkApi.ts         # Mock 데이터 수정
├── types/
│   └── walk.ts                # 타입 정의 개선
└── App.tsx                    # 새로운 라우트 추가
```

## 🔧 구현 세부사항

### 1. 산책로 등록 플로우
```typescript
// 1. 개인 산책 선택 → "공유하기" 버튼 클릭
// 2. 산책로 등록 페이지로 이동 (/trail-register/:walkId)
// 3. 제목, 설명 입력 + 이미지 업로드
// 4. FormData로 서버 전송
// 5. 등록 완료 후 산책 기록 목록으로 이동
```

### 2. 리뷰 작성 플로우
```typescript
// 1. 등록된 산책로 선택 → "리뷰 남기기" 버튼 클릭
// 2. 리뷰 작성 페이지로 이동 (/reviews/:trailId)
// 3. 별점 선택 (1-5점) + 리뷰 내용 작성
// 4. 서버로 전송
// 5. 작성 완료 후 산책 기록 목록으로 이동
```

### 3. 조건부 버튼 표시 로직
```typescript
// 개인 산책 (공유 가능)
{!walk.isUploaded && !walk.trailId && (
  <button>공유하기</button>
)}

// 등록된 산책로 (리뷰 가능)
{walk.trailId && walk.isUploaded && (
  <button>리뷰 남기기</button>
)}
```

## 🧪 테스트 시나리오

### 1. 산책로 등록 테스트
- [ ] 개인 산책에서 "공유하기" 버튼 표시 확인
- [ ] 산책로 등록 페이지 접근 및 데이터 로드 확인
- [ ] 이미지 업로드 기능 테스트 (파일 크기, 형식 검증)
- [ ] 제목/설명 입력 및 유효성 검사
- [ ] 등록 완료 후 목록 페이지 이동 확인

### 2. 리뷰 작성 테스트
- [ ] 등록된 산책로에서 "리뷰 남기기" 버튼 표시 확인
- [ ] 리뷰 작성 페이지 접근 확인
- [ ] 별점 선택 및 리뷰 내용 입력 테스트
- [ ] 작성 완료 후 목록 페이지 이동 확인

### 3. 조건부 버튼 테스트
- [ ] 개인 산책: "공유하기" 버튼만 표시
- [ ] 등록된 산책로: "리뷰 남기기" 버튼만 표시
- [ ] 내가 업로드한 산책로: 향후 버튼 숨김 처리 예정

## 🚨 알려진 이슈

### 1. API 제약사항
- **산책로 소유자 구분**: 현재 API로는 "내가 만든 산책로"와 "다른 사람이 만든 산책로"를 구분할 수 없음
- **리뷰 작성 여부 확인**: 이미 리뷰를 남겼는지 확인하는 API 미구현
- **해결 방안**: 향후 API 개선 시 `walkType`, `isMyTrail`, `hasMyReview` 필드 추가 예정

### 2. 카카오 API 의존성 제거
- **이전**: 지도 표시를 위해 카카오 API 사용
- **현재**: 이미지 업로드로 대체하여 외부 API 의존성 제거

## 🔮 향후 개선 계획

### 1. API 개선
```typescript
// WalkRecord 타입에 추가 예정
export interface WalkRecord {
  // ... 기존 필드들
  walkType: 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL';
  isMyTrail?: boolean; // 내가 만든 산책로인지 여부
  hasMyReview?: boolean; // 내가 리뷰를 남겼는지 여부
}
```

### 2. 완전한 버튼 표시 로직
```typescript
// 개선 후 로직
{!walk.isUploaded ? (
  // 개인 산책: 공유하기
  <button>공유하기</button>
) : walk.trailId && walk.isUploaded && !walk.isMyTrail && !walk.hasMyReview ? (
  // 다른 사람이 만든 산책로 + 리뷰 안남김: 리뷰 남기기
  <button>리뷰 남기기</button>
) : null}
```

### 3. 필요한 API 엔드포인트
- `GET /api/trails/{trailId}/ownership`: 산책로 소유자 확인
- `GET /api/reviews/my/{trailId}`: 내 리뷰 작성 여부 확인
- `GET /api/walks` 응답에 `walkType`, `isMyTrail`, `hasMyReview` 필드 추가

## 📊 성능 및 접근성

### 1. 성능 최적화
- **이미지 압축**: 클라이언트에서 이미지 크기 제한 (5MB)
- **지연 로딩**: 필요한 컴포넌트만 동적 import
- **메모리 관리**: FileReader 사용 후 메모리 해제

### 2. 접근성 개선
- **키보드 네비게이션**: 모든 버튼과 입력 필드에 키보드 접근성 지원
- **스크린 리더**: 적절한 alt 텍스트와 aria-label 제공
- **색상 대비**: 충분한 색상 대비로 가독성 확보

## 🎯 마일스톤

- [x] 산책로 등록 기능 구현
- [x] 리뷰 작성 기능 구현
- [x] 조건부 버튼 표시 로직 구현
- [x] 이미지 업로드 기능 구현
- [x] 반응형 레이아웃 구현
- [x] 타입 안전성 강화
- [ ] API 개선 (향후)
- [ ] 완전한 소유자 구분 로직 (향후)

## 🔗 관련 이슈

- Closes #42
- Related to #41 (산책 기록 기능)
- Related to #43 (리뷰 시스템)

---

**리뷰어**: @team-lead, @frontend-dev  
**테스터**: @qa-team  
**배포**: Staging → Production 
