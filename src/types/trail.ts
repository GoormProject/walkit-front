// Trail 인터페이스 정의
export interface Trail {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  distance: number;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  // 상세 정보 (API에서 추가로 제공되는 필드들)
  location?: string;
  routeImageUrl?: string;
  pathId?: number;
  startPoint?: [number, number]; // [경도, 위도]
  path?: [number, number][]; // [[경도, 위도], [경도, 위도], ...]
}

// GeoJSON 타입 정의
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [경도, 위도]
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][]; // [경도, 위도] 배열
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONPoint | GeoJSONLineString;
  properties: {
    id?: string;
    name?: string;
    courseType?: string;
    difficulty?: string;
    distance?: number;
    duration?: number;
    [key: string]: string | number | boolean | null | undefined;
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// 카카오 맵 API 타입 정의
export interface KakaoMapPolylineOptions {
  map: kakao.maps.Map;
  path: kakao.maps.LatLng[];
  strokeWeight?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  zIndex?: number;
  endArrow?: boolean;
}

export interface KakaoMapMarkerOptions {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  title?: string;
  clickable?: boolean;
  draggable?: boolean;
  zIndex?: number;
}

// 코스별 스타일 정의
export interface CourseStyle {
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  markerColor?: string;
}

// 변환된 경로 데이터
export interface TrailPathData {
  id: string;
  name: string;
  courseType: string;
  coordinates: kakao.maps.LatLng[];
  style: CourseStyle;
  properties: Record<string, string | number | boolean | null | undefined>;
}

// 진행률 추적 관련 타입
export interface TrailProgress {
  currentPosition: kakao.maps.LatLng;
  progress: number; // 0.0 ~ 1.0
  completedDistance: number;
  totalDistance: number;
  nearestPoint: kakao.maps.LatLng;
  nearestPointIndex: number;
}

// 이징 함수 타입
export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

// 분할된 경로 데이터
export interface SplitPathData {
  completed: kakao.maps.LatLng[];
  remaining: kakao.maps.LatLng[];
} 
