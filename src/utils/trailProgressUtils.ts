import type { TrailProgress, SplitPathData, EasingFunction } from '../types/trail';
import { calculateDistance } from './converter/pathConverter';
import type { Coordinate } from '../types/map';

// 이징 함수들
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};

// GPS 위치를 경로상의 가장 가까운 지점으로 매핑
export const findNearestPointOnPath = (
  currentPosition: kakao.maps.LatLng,
  path: kakao.maps.LatLng[]
): { nearestPoint: kakao.maps.LatLng; distance: number; pathIndex: number } => {
  if (path.length === 0) {
    throw new Error('경로가 비어있습니다.');
  }

  let minDistance = Infinity;
  let nearestIndex = 0;
  let nearestPoint = path[0];

  // 각 경로 포인트와의 거리 계산
  for (let i = 0; i < path.length; i++) {
    const pathPoint = path[i];
    const distance = calculateDistance(
      { lat: currentPosition.getLat(), lng: currentPosition.getLng() },
      { lat: pathPoint.getLat(), lng: pathPoint.getLng() }
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
      nearestPoint = pathPoint;
    }
  }

  return {
    nearestPoint,
    distance: minDistance,
    pathIndex: nearestIndex
  };
};

// 누적 이동 거리 계산
export const calculateCompletedDistance = (
  path: kakao.maps.LatLng[],
  currentIndex: number
): number => {
  if (currentIndex <= 0) return 0;
  if (currentIndex >= path.length) return calculateTotalPathDistance(path);

  let totalDistance = 0;
  for (let i = 1; i <= currentIndex; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    totalDistance += calculateDistance(
      { lat: prev.getLat(), lng: prev.getLng() },
      { lat: curr.getLat(), lng: curr.getLng() }
    );
  }
  return totalDistance;
};

// 전체 경로 거리 계산
export const calculateTotalPathDistance = (path: kakao.maps.LatLng[]): number => {
  if (path.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    totalDistance += calculateDistance(
      { lat: prev.getLat(), lng: prev.getLng() },
      { lat: curr.getLat(), lng: curr.getLng() }
    );
  }
  return totalDistance;
};

// 진행률 계산 (0.0 ~ 1.0)
export const calculateProgress = (
  currentPosition: kakao.maps.LatLng,
  path: kakao.maps.LatLng[]
): TrailProgress => {
  if (path.length === 0) {
    throw new Error('경로가 비어있습니다.');
  }

  const { nearestPoint, distance, pathIndex } = findNearestPointOnPath(currentPosition, path);
  const completedDistance = calculateCompletedDistance(path, pathIndex);
  const totalDistance = calculateTotalPathDistance(path);

  // 진행률 계산 (거리 기반)
  const progress = totalDistance > 0 ? Math.min(completedDistance / totalDistance, 1.0) : 0.0;

  return {
    currentPosition,
    progress,
    completedDistance,
    totalDistance,
    nearestPoint,
    nearestPointIndex: pathIndex
  };
};

// 경로를 완료 구간과 남은 구간으로 분할
export const splitPathByProgress = (
  path: kakao.maps.LatLng[],
  progress: number
): SplitPathData => {
  if (path.length === 0) {
    return { completed: [], remaining: [] };
  }

  const splitIndex = Math.floor(path.length * progress);
  const completed = path.slice(0, splitIndex);
  const remaining = path.slice(splitIndex);

  return { completed, remaining };
};

// 진행률에 따른 경로 분할 (거리 기반 정확한 분할)
export const splitPathByDistance = (
  path: kakao.maps.LatLng[],
  completedDistance: number,
  totalDistance: number
): SplitPathData => {
  if (path.length === 0 || totalDistance === 0) {
    return { completed: [], remaining: path };
  }

  const progress = Math.min(completedDistance / totalDistance, 1.0);
  let currentDistance = 0;
  let splitIndex = 0;

  // 정확한 분할 지점 찾기
  for (let i = 1; i < path.length; i++) {
    const segmentDistance = calculateDistance(
      { lat: path[i - 1].getLat(), lng: path[i - 1].getLng() },
      { lat: path[i].getLat(), lng: path[i].getLng() }
    );

    if (currentDistance + segmentDistance <= completedDistance) {
      currentDistance += segmentDistance;
      splitIndex = i;
    } else {
      // 부분적으로 완료된 세그먼트 처리
      const remainingInSegment = completedDistance - currentDistance;
      const segmentProgress = remainingInSegment / segmentDistance;
      
      // 보간된 중간점 계산
      const interpolatedPoint = new kakao.maps.LatLng(
        path[i - 1].getLat() + (path[i].getLat() - path[i - 1].getLat()) * segmentProgress,
        path[i - 1].getLng() + (path[i].getLng() - path[i - 1].getLng()) * segmentProgress
      );

      return {
        completed: [...path.slice(0, i), interpolatedPoint],
        remaining: [interpolatedPoint, ...path.slice(i)]
      };
    }
  }

  return {
    completed: path.slice(0, splitIndex + 1),
    remaining: path.slice(splitIndex + 1)
  };
}; 
