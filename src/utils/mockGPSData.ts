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

// GPS 에러 코드 상수 (브라우저 표준)
export const GPS_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
} as const;

// GPS 에러 모의 데이터
export const MOCK_GPS_ERRORS: Partial<GeolocationPositionError>[] = [
  {
    code: GPS_ERROR_CODES.PERMISSION_DENIED,
    message: "User denied Geolocation"
  },
  {
    code: GPS_ERROR_CODES.POSITION_UNAVAILABLE,
    message: "Position unavailable"
  },
  {
    code: GPS_ERROR_CODES.TIMEOUT,
    message: "Timeout"
  }
];

// 홍대입구역에서 신촌역까지의 가상 GPS 경로 생성
export const createHongdaeToSinchonPath = () => {
  // 홍대입구역 좌표 (2호선)
  const hongdaeStation = {
    lat: 37.5572,
    lng: 126.9254
  };
  
  // 신촌역 좌표 (2호선)
  const sinchonStation = {
    lat: 37.5552,
    lng: 126.9368
  };
  
  // 직선 거리 계산 (미터)
  const distance = calculateDistance(hongdaeStation, sinchonStation);
  
  // 시속 20km = 약 5.56 m/s
  const speedMps = 5.56;
  
  // 5초마다 포인트를 잡으므로 5초간 이동 거리
  const distancePerInterval = speedMps * 5; // 약 27.8m
  
  // 총 포인트 수 계산
  const totalPoints = Math.ceil(distance / distancePerInterval);
  
  // 경로 생성
  const path: Array<{lat: number, lng: number}> = [];
  
  for (let i = 0; i <= totalPoints; i++) {
    const ratio = i / totalPoints;
    const lat = hongdaeStation.lat + (sinchonStation.lat - hongdaeStation.lat) * ratio;
    const lng = hongdaeStation.lng + (sinchonStation.lng - hongdaeStation.lng) * ratio;
    
    path.push({ lat, lng });
  }
  
  return {
    path,
    totalDistance: distance,
    totalTime: distance / speedMps, // 초 단위
    intervalTime: 5, // 5초
    speed: speedMps
  };
};

// 두 지점 간의 거리 계산 (미터)
const calculateDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}; 
