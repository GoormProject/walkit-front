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
