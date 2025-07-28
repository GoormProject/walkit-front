// 서울 시청 주변 산책로 좌표
export const MOCK_PATH_COORDS = [
  { lat: 37.5666805, lng: 126.9784147 }, // 서울 시청
  { lat: 37.5668953, lng: 126.9786722 }, // 시청 광장
  { lat: 37.5673091, lng: 126.9789511 }, // 시청 앞 횡단보도
  { lat: 37.5677229, lng: 126.9792300 }, // 을지로입구역 방향
  { lat: 37.5681367, lng: 126.9795089 }, // 을지로입구역
  { lat: 37.5685505, lng: 126.9797878 }, // 롯데백화점 방향
  { lat: 37.5689643, lng: 126.9800667 }, // 롯데백화점
  { lat: 37.5693781, lng: 126.9803456 }, // 명동성당 방향
  { lat: 37.5697919, lng: 126.9806245 }, // 명동성당
];

// GPS 정확도 시뮬레이션 값 (미터 단위)
export const MOCK_ACCURACY_VALUES = [
  10,  // 매우 정확
  30,  // 정확
  60,  // 부정확
  120, // 매우 부정확
  45,  // 다시 개선
  25,  // 더 개선
];

// GPS 에러 시뮬레이션
export const MOCK_GPS_ERRORS = [
  {
    code: 1, // PERMISSION_DENIED
    message: "위치 권한이 거부되었습니다",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
  },
  {
    code: 2, // POSITION_UNAVAILABLE
    message: "GPS 신호를 찾을 수 없습니다",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
  },
  {
    code: 3, // TIMEOUT
    message: "GPS 신호 수신 시간이 초과되었습니다",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
  }
]; 
