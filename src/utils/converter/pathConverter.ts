import type { WalkPath } from '../../types/walk';
import type { Coordinate } from '../../types/map';
import { getCourseStyle } from './trailConverter';

/**
 * 두 좌표를 WKT LINESTRING 형식으로 변환
 */
export const coordinatesToWKT = (start: Coordinate, end: Coordinate): string => {
  return `LINESTRING(${start.lng} ${start.lat}, ${end.lng} ${end.lat})`;
};

/**
 * 두 좌표 사이의 거리를 직접 계산 (km) - Haversine 공식
 */
const calculateDistanceDirect = (start: Coordinate, end: Coordinate): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (end.lat - start.lat) * Math.PI / 180;
  const dLng = (end.lng - start.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 두 좌표 사이의 거리를 계산 (km)
 */
export const calculateDistance = (start: Coordinate, end: Coordinate): number => {
  return calculateDistanceDirect(start, end);
};

// 이징 함수들
const easing = {
  // 부드러운 가속
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // 더 자연스러운 가속/감속
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

/**
 * 두 좌표 사이의 중간 좌표들을 생성합니다 (이징 적용).
 * @param start 시작 좌표
 * @param end 끝 좌표
 * @param count 생성할 중간 좌표의 개수
 * @returns 보간된 좌표 배열 (시작점과 끝점 포함)
 */
export const interpolateCoordinates = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  count: number
): { lat: number; lng: number }[] => {
  const points: { lat: number; lng: number }[] = [];
  const distance = calculateDistanceDirect(start, end);
  
  // 거리에 따라 보간 방식 조정
  const easingFn = distance > 0.1 ? easing.easeInOutCubic : easing.easeInOutQuad;
  
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const easedT = easingFn(t);
    points.push({
      lat: start.lat + (end.lat - start.lat) * easedT,
      lng: start.lng + (end.lng - start.lng) * easedT
    });
  }
  
  return points;
};

/**
 * 경로의 모든 좌표들 사이에 중간 좌표를 생성합니다.
 * @param path 원본 경로 좌표 배열
 * @param pointsPerSegment 각 세그먼트 당 생성할 기본 중간 좌표의 개수
 * @returns 보간된 전체 경로 좌표 배열
 */
export const interpolatePath = (
  path: { lat: number; lng: number }[],
  pointsPerSegment: number
): { lat: number; lng: number }[] => {
  if (path.length < 2) return path;

  const interpolatedPath: { lat: number; lng: number }[] = [];
  
  // 전체 경로의 총 거리 계산
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    totalDistance += calculateDistanceDirect(start, end);
  }

  // 평균 세그먼트 길이 계산 (km)
  const avgSegmentLength = totalDistance / (path.length - 1);
  
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const segmentDistance = calculateDistanceDirect(start, end);
    
    // 거리에 따른 보간 포인트 수 동적 조정
    // 1. 기본 포인트 수를 거리 비율로 조정
    const distanceRatio = segmentDistance / avgSegmentLength;
    // 2. 최소 포인트 수 보장
    const basePoints = Math.max(pointsPerSegment, Math.floor(pointsPerSegment * distanceRatio));
    // 3. 거리에 따른 추가 포인트
    const additionalPoints = Math.floor(segmentDistance * 100); // 100m당 1포인트 추가
    // 4. 최종 포인트 수 결정 (최소 기본 포인트 수 보장)
    const finalPoints = Math.max(basePoints + additionalPoints, pointsPerSegment);
    
    const segment = interpolateCoordinates(start, end, finalPoints);
    
    // 마지막 점은 다음 세그먼트의 시작점과 중복되므로 제외
    if (i < path.length - 2) {
      segment.pop();
    }
    
    interpolatedPath.push(...segment);
  }
  
  return interpolatedPath;
};

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
