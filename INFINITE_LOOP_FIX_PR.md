# 🔧 편의시설 검색 무한 루프 문제 해결

## 📋 개요

홈 화면에서 편의시설(화장실) 버튼 클릭 시 발생하던 무한 루프 문제를 근본적으로 해결했습니다.

## 🚨 문제 상황

### 발생 현상
- 편의시설 버튼 클릭 시 마커가 생성되고 제거되는 무한 루프 발생
- GPS 위치 업데이트마다 검색이 재실행됨
- 카테고리 해제 후에도 마커가 계속 생성됨
- 사용자 경험 저해 및 성능 문제 야기

### 로그 패턴 (문제 상황)
```
📍 GPS 위치 업데이트: {lat: '37.663483', lng: '126.764718'}
🔄 카테고리 변경 감지: {selectedCategory: 'toilet', ...}
🚀 검색 실행 - 모든 조건 충족
🗑️ 검색 마커 제거: 15 개
📍 새로운 마커 생성: 15 개
(위 과정이 무한 반복)
```

## 🔍 원인 분석

### 1차 원인: GPS 위치 의존성
```typescript
// 문제 코드
}, [selectedCategory, isPlacesServiceReady, position, categories, performKeywordSearch, isMapReady]);
//                                      ^^^^^^^^
//                                      GPS 위치 업데이트마다 useEffect 재실행
```

### 2차 원인: categories 배열 재생성
```typescript
// 문제 코드 - 컴포넌트 내부에서 매번 재생성
const categories: Category[] = [
  { id: 'toilet', name: '화장실', code: '', color: '#4F46E5' },
  // ... 매번 새로운 참조 생성
];
```

### 3차 원인: 비동기 상태 업데이트 타이밍
- React 상태 업데이트의 비동기성으로 인한 카테고리 상태 불일치
- 카테고리 해제 후에도 진행 중인 검색이 완료되어 마커 생성

## ✅ 해결 방법

### 1. GPS 위치 의존성 제거
```typescript
// 수정 전
}, [selectedCategory, isPlacesServiceReady, position, categories, performKeywordSearch, isMapReady]);

// 수정 후  
}, [selectedCategory, isPlacesServiceReady, isMapReady]);
```

### 2. Categories 배열 컴포넌트 외부 이동
```typescript
// 수정 전 - 컴포넌트 내부
const Home = () => {
  const categories: Category[] = [
    // ... 매번 재생성
  ];
};

// 수정 후 - 컴포넌트 외부
const CATEGORIES: Category[] = [
  { id: 'toilet', name: '화장실', code: '', color: '#4F46E5' },
  { id: 'convenience', name: '편의점', code: 'CS2', color: '#059669' },
  { id: 'subway', name: '지하철역', code: 'SW8', color: '#7C3AED' }
];
```

### 3. 실시간 카테고리 상태 추적
```typescript
// 추가된 코드
const selectedCategoryRef = useRef<string>('');

useEffect(() => {
  selectedCategoryRef.current = selectedCategory;
}, [selectedCategory]);

// displayPlaces에서 실시간 상태 확인
if (!selectedCategoryRef.current || selectedCategoryRef.current === '') {
  console.log('⏭️ 카테고리가 해제됨 - 마커 생성 건너뜀 (ref 확인)');
  return;
}
```

### 4. 비동기 검색 완료 후 카테고리 상태 확인
```typescript
// performKeywordSearch에서 카테고리 상태 확인
if (selectedCategoryRef.current === category.id) {
  onSuccess(data, keywords[idx]);
} else {
  console.log('⏭️ 카테고리가 변경됨 - 마커 생성 건너뜀');
}
```

### 5. 거리 기반 선택적 재검색 추가
```typescript
// 500m 이상 이동했을 때만 재검색
if (lastSearchPositionRef.current) {
  const distance = calculateDistance(lastSearchPositionRef.current, position);
  if (distance < 0.5) { // 0.5km = 500m
    return;
  }
}
```

## 🎯 주요 변경 사항

### 수정된 파일
- `src/pages/index.tsx` - 무한 루프 해결 로직 구현

### 커밋 히스토리
1. **🔧 카테고리 해제 후 마커 생성 방지** - displayPlaces에서 카테고리 상태 확인
2. **🔧 performKeywordSearch에서 카테고리 상태 확인** - 비동기 검색 완료 후 마커 생성 방지
3. **🔧 selectedCategoryRef 추가로 실시간 카테고리 상태 추적** - 비동기 상태 업데이트 문제 완전 해결
4. **🔧 GPS 위치 의존성 제거로 무한 루프 완전 해결** - 근본 원인 수정
5. **🔧 categories 배열 컴포넌트 외부 이동** - 무한 루프 진짜 원인 해결

## 🚀 개선된 동작 흐름

### 이전 (무한 루프)
```
GPS 업데이트 → 리렌더링 → 새로운 categories → useEffect 재실행 → 검색 → 마커 생성/제거 → (무한 반복)
```

### 현재 (정상 동작)
```
카테고리 클릭 → selectedCategory 변경 → useEffect 한 번만 실행 → 검색 완료 → 종료
GPS 업데이트 → 리렌더링 → CATEGORIES는 같은 참조 → useEffect 재실행 안함 ✅
카테고리 해제 → selectedCategory = '' → 검색 안함 → 마커 제거 → 완료 ✅
```

## ✨ 기대 효과

### 사용자 경험 개선
- ✅ 편의시설 버튼 클릭 시 정상적인 마커 생성
- ✅ 카테고리 해제 시 깔끔한 마커 제거
- ✅ GPS 위치 업데이트 시 무한 루프 없이 정상 동작

### 성능 개선
- ✅ 불필요한 검색 요청 제거
- ✅ DOM 조작 최소화
- ✅ 메모리 사용량 최적화

### 코드 품질 개선
- ✅ useEffect 의존성 최적화
- ✅ 상태 관리 안정성 향상
- ✅ 비동기 작업 처리 개선

## 📊 테스트 결과

### 해결된 시나리오
1. **편의시설 버튼 클릭** → 마커 한 번만 생성 ✅
2. **카테고리 해제** → 마커 완전 제거 ✅  
3. **GPS 위치 업데이트** → 무한 루프 없음 ✅
4. **500m 이상 이동** → 필요시에만 재검색 ✅

### 예상 로그 (개선 후)
```
🔄 카테고리 변경 감지 (카테고리 클릭시에만)
🚀 검색 실행 - 모든 조건 충족 (한 번만)
📍 위치 크게 변경됨 - 재검색 실행 (500m 이상 이동시에만)
⏭️ 카테고리가 해제됨 - 마커 생성 건너뜀 (ref 확인)
```

## 🔗 관련 이슈

- Issue: #48 - 편의시설 검색 무한 루프 문제
- 관련 브랜치: `fix/#48-infinite-loop-mark-remove`

## 📝 체크리스트

- [x] 무한 루프 근본 원인 분석 완료
- [x] GPS 위치 의존성 제거
- [x] Categories 배열 컴포넌트 외부 이동  
- [x] 실시간 카테고리 상태 추적 구현
- [x] 비동기 검색 완료 후 상태 확인 로직 추가
- [x] 거리 기반 선택적 재검색 기능 구현
- [x] 테스트 및 검증 완료
- [x] 코드 리뷰 준비 완료

## 🎉 결론

React useEffect 의존성 배열의 참조 안정성 문제를 해결하여 무한 루프를 완전히 제거했습니다. 이로 인해 사용자 경험이 대폭 개선되고, 앱의 성능과 안정성이 향상되었습니다. 
