import type { 
  GeoJSONFeatureCollection, 
  GeoJSONFeature, 
  GeoJSONLineString, 
  GeoJSONPoint,
  TrailPathData,
  CourseStyle,
  KakaoMapPolylineOptions,
  KakaoMapMarkerOptions
} from '../types/trail';

/**
 * GeoJSON 좌표를 카카오 맵 LatLng 객체로 변환
 * @param coordinates GeoJSON 좌표 [경도, 위도]
 * @returns 카카오 맵 LatLng 객체
 */
export const convertToLatLng = (coordinates: [number, number]): kakao.maps.LatLng => {
  const [lng, lat] = coordinates; // GeoJSON은 [경도, 위도] 순서
  return new kakao.maps.LatLng(lat, lng);
};

/**
 * GeoJSON 좌표를 순수 좌표 객체로 변환 (카카오 맵 SDK 없이 사용)
 * @param coordinates GeoJSON 좌표 [경도, 위도]
 * @returns 좌표 객체
 */
export const convertToCoordinates = (coordinates: [number, number]): { lat: number; lng: number } => {
  const [lng, lat] = coordinates; // GeoJSON은 [경도, 위도] 순서
  return { lat, lng };
};

/**
 * GeoJSON LineString을 카카오 맵 LatLng 배열로 변환
 * @param lineString GeoJSON LineString
 * @returns 카카오 맵 LatLng 배열
 */
export const convertLineStringToLatLngArray = (lineString: GeoJSONLineString): kakao.maps.LatLng[] => {
  return lineString.coordinates.map(convertToLatLng);
};

/**
 * GeoJSON LineString을 순수 좌표 배열로 변환 (카카오 맵 SDK 없이 사용)
 * @param lineString GeoJSON LineString
 * @returns 좌표 배열
 */
export const convertLineStringToCoordinatesArray = (lineString: GeoJSONLineString): { lat: number; lng: number }[] => {
  return lineString.coordinates.map(convertToCoordinates);
};

/**
 * GeoJSON Point를 카카오 맵 LatLng로 변환
 * @param point GeoJSON Point
 * @returns 카카오 맵 LatLng 객체
 */
export const convertPointToLatLng = (point: GeoJSONPoint): kakao.maps.LatLng => {
  return convertToLatLng(point.coordinates);
};

/**
 * 코스 타입에 따른 스타일 반환
 * @param courseType 코스 타입
 * @returns 코스별 스타일
 */
export const getCourseStyle = (courseType: string): CourseStyle => {
  const styles: Record<string, CourseStyle> = {
    'easy': {
      strokeColor: '#4CAF50', // 초록색
      strokeWeight: 3,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      markerColor: '#4CAF50'
    },
    'medium': {
      strokeColor: '#FF9800', // 주황색
      strokeWeight: 4,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      markerColor: '#FF9800'
    },
    'hard': {
      strokeColor: '#F44336', // 빨간색
      strokeWeight: 5,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      markerColor: '#F44336'
    },
    'scenic': {
      strokeColor: '#2196F3', // 파란색
      strokeWeight: 3,
      strokeOpacity: 0.8,
      strokeStyle: 'dashed',
      markerColor: '#2196F3'
    },
    'default': {
      strokeColor: '#9C27B0', // 보라색
      strokeWeight: 3,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      markerColor: '#9C27B0'
    }
  };

  return styles[courseType.toLowerCase()] || styles.default;
};

/**
 * GeoJSON Feature를 TrailPathData로 변환
 * @param feature GeoJSON Feature
 * @returns 변환된 경로 데이터
 */
export const convertFeatureToTrailPath = (feature: GeoJSONFeature): TrailPathData | null => {
  if (feature.geometry.type === 'LineString') {
    const lineString = feature.geometry as GeoJSONLineString;
    const coordinates = convertLineStringToLatLngArray(lineString);
    const courseType = feature.properties.courseType || 'default';
    const style = getCourseStyle(courseType);

    return {
      id: feature.properties.id || `trail-${Date.now()}`,
      name: feature.properties.name || 'Unnamed Trail',
      courseType,
      coordinates,
      style,
      properties: feature.properties
    };
  }

  return null;
};

/**
 * GeoJSON Feature를 TrailPathData로 변환 (카카오 맵 SDK 없이 사용)
 * @param feature GeoJSON Feature
 * @returns 변환된 경로 데이터
 */
export const convertFeatureToTrailPathSafe = (feature: GeoJSONFeature): Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] } | null => {
  if (feature.geometry.type === 'LineString') {
    const lineString = feature.geometry as GeoJSONLineString;
    const coordinates = convertLineStringToCoordinatesArray(lineString);
    const courseType = feature.properties.courseType || 'default';
    const style = getCourseStyle(courseType);

    return {
      id: feature.properties.id || `trail-${Date.now()}`,
      name: feature.properties.name || 'Unnamed Trail',
      courseType,
      coordinates,
      style,
      properties: feature.properties
    };
  }

  return null;
};

/**
 * GeoJSON FeatureCollection을 TrailPathData 배열로 변환
 * @param featureCollection GeoJSON FeatureCollection
 * @returns 변환된 경로 데이터 배열
 */
export const convertFeatureCollectionToTrailPaths = (
  featureCollection: GeoJSONFeatureCollection
): TrailPathData[] => {
  return featureCollection.features
    .map(convertFeatureToTrailPath)
    .filter((path): path is TrailPathData => path !== null);
};

/**
 * GeoJSON FeatureCollection을 TrailPathData 배열로 변환 (카카오 맵 SDK 없이 사용)
 * @param featureCollection GeoJSON FeatureCollection
 * @returns 변환된 경로 데이터 배열
 */
export const convertFeatureCollectionToTrailPathsSafe = (
  featureCollection: GeoJSONFeatureCollection
): (Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] })[] => {
  return featureCollection.features
    .map(convertFeatureToTrailPathSafe)
    .filter((path): path is Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] } => path !== null);
};

/**
 * TrailPathData로부터 카카오 맵 폴리라인 옵션 생성
 * @param trailPath 경로 데이터
 * @param map 카카오 맵 인스턴스
 * @returns 폴리라인 옵션
 */
export const createPolylineOptions = (
  trailPath: TrailPathData,
  map: kakao.maps.Map
): KakaoMapPolylineOptions => {
  return {
    map,
    path: trailPath.coordinates,
    strokeWeight: trailPath.style.strokeWeight,
    strokeColor: trailPath.style.strokeColor,
    strokeOpacity: trailPath.style.strokeOpacity,
    strokeStyle: trailPath.style.strokeStyle,
    zIndex: 1
  };
};

/**
 * TrailPathData로부터 카카오 맵 마커 옵션 배열 생성
 * @param trailPath 경로 데이터
 * @param map 카카오 맵 인스턴스
 * @returns 마커 옵션 배열
 */
export const createMarkerOptions = (
  trailPath: TrailPathData,
  map: kakao.maps.Map
): KakaoMapMarkerOptions[] => {
  return trailPath.coordinates.map((position, index) => ({
    map,
    position,
    title: `${trailPath.name} - Point ${index + 1}`,
    clickable: true,
    draggable: false,
    zIndex: 2
  }));
};

/**
 * 단일 좌표 배열을 카카오 맵 폴리라인 옵션으로 변환
 * @param coordinates 좌표 배열 [[위도, 경도], ...]
 * @param map 카카오 맵 인스턴스
 * @param style 스타일 옵션
 * @returns 폴리라인 옵션
 */
export const createPolylineFromCoordinates = (
  coordinates: [number, number][],
  map: kakao.maps.Map,
  style: Partial<CourseStyle> = {}
): KakaoMapPolylineOptions => {
  const latLngArray = coordinates.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng));
  const defaultStyle = getCourseStyle('default');

  return {
    map,
    path: latLngArray,
    strokeWeight: style.strokeWeight || defaultStyle.strokeWeight,
    strokeColor: style.strokeColor || defaultStyle.strokeColor,
    strokeOpacity: style.strokeOpacity || defaultStyle.strokeOpacity,
    strokeStyle: style.strokeStyle || defaultStyle.strokeStyle,
    zIndex: 1
  };
}; 
