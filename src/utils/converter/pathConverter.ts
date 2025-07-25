import type { WalkPath } from '../types/walk';
import { getCourseStyle } from './trailConverter';

/**
 * WKT LINESTRING을 파싱하여 좌표 배열로 변환
 * @param wktString WKT LINESTRING 문자열 (예: "LINESTRING(126.9780 37.5665, 126.9790 37.5675)")
 * @returns 좌표 배열 [[경도, 위도], ...]
 */
export const parseWktLineString = (wktString: string): [number, number][] => {
  try {
    // LINESTRING(경도1 위도1, 경도2 위도2, ...) 형식 파싱
    const match = wktString.match(/LINESTRING\(([^)]+)\)/i);
    if (!match) {
      throw new Error('유효하지 않은 LINESTRING 형식입니다.');
    }

    const coordinates = match[1].split(',').map(coord => {
      const [lng, lat] = coord.trim().split(' ').map(Number);
      return [lng, lat] as [number, number];
    });

    return coordinates;
  } catch (error) {
    console.error('WKT 파싱 오류:', error);
    throw new Error('경로 데이터 파싱에 실패했습니다.');
  }
};

/**
 * WalkPath를 카카오 맵 폴리라인 옵션으로 변환
 * @param walkPath 산책 경로 데이터
 * @param map 카카오 맵 인스턴스
 * @returns 폴리라인 옵션
 */
export const convertWalkPathToPolylineOptions = (
  walkPath: WalkPath,
  map: kakao.maps.Map
) => {
  const coordinates = parseWktLineString(walkPath.path);
  const latLngArray = coordinates.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
  
  const courseType = walkPath.courseType || 'default';
  const style = getCourseStyle(courseType);

  return {
    map,
    path: latLngArray,
    strokeWeight: style.strokeWeight,
    strokeColor: style.strokeColor,
    strokeOpacity: style.strokeOpacity,
    strokeStyle: style.strokeStyle,
    zIndex: 1
  };
};

/**
 * WalkPath를 카카오 맵 마커 옵션 배열로 변환
 * @param walkPath 산책 경로 데이터
 * @param map 카카오 맵 인스턴스
 * @returns 마커 옵션 배열
 */
export const convertWalkPathToMarkerOptions = (
  walkPath: WalkPath,
  map: kakao.maps.Map
) => {
  const coordinates = parseWktLineString(walkPath.path);
  
  return coordinates.map(([lng, lat], index) => ({
    map,
    position: new kakao.maps.LatLng(lat, lng),
    title: `${walkPath.name || '산책 경로'} - Point ${index + 1}`,
    clickable: true,
    draggable: false,
    zIndex: 2
  }));
};

/**
 * 여러 WalkPath를 카카오 맵 폴리라인 옵션 배열로 변환
 * @param walkPaths 산책 경로 데이터 배열
 * @param map 카카오 맵 인스턴스
 * @returns 폴리라인 옵션 배열
 */
export const convertWalkPathsToPolylineOptions = (
  walkPaths: WalkPath[],
  map: kakao.maps.Map
) => {
  return walkPaths.map(walkPath => convertWalkPathToPolylineOptions(walkPath, map));
};

/**
 * 경로의 중심점 계산
 * @param walkPath 산책 경로 데이터
 * @returns 중심점 좌표 [위도, 경도]
 */
export const calculatePathCenter = (walkPath: WalkPath): [number, number] => {
  const coordinates = parseWktLineString(walkPath.path);
  
  const totalLng = coordinates.reduce((sum, [lng]) => sum + lng, 0);
  const totalLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0);
  
  return [totalLat / coordinates.length, totalLng / coordinates.length];
};

/**
 * 경로의 총 거리 계산 (대략적)
 * @param walkPath 산책 경로 데이터
 * @returns 총 거리 (km)
 */
export const calculatePathDistance = (walkPath: WalkPath): number => {
  const coordinates = parseWktLineString(walkPath.path);
  let totalDistance = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    
    // Haversine 공식으로 거리 계산
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += R * c;
  }
  
  return totalDistance;
}; 
