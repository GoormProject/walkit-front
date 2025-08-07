import type { WalkDetail, WalkRecord } from '../types/walk';

/**
 * 거리를 읽기 쉬운 형식으로 변환
 * @param distance 미터 단위 거리
 * @returns 포맷된 거리 문자열
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};

/**
 * 시간을 읽기 쉬운 형식으로 변환
 * @param time 시간 (초 단위) 또는 시간 문자열
 * @returns 포맷된 시간 문자열 (HH:MM:SS)
 */
export const formatTime = (time: string | number): string => {
  const seconds = typeof time === 'string' ? parseInt(time, 10) : time;
  if (isNaN(seconds)) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * 페이스를 읽기 쉬운 형식으로 변환
 * @param pace 페이스 (초/미터) 또는 페이스 문자열
 * @returns 포맷된 페이스 문자열 (분:초/km)
 */
export const formatPace = (pace: string | number): string => {
  const paceValue = typeof pace === 'string' ? parseFloat(pace) : pace;
  if (isNaN(paceValue) || paceValue <= 0) return '--:--';
  
  // 초/미터를 분:초/km로 변환
  const secondsPerKm = paceValue * 1000;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
};

/**
 * 평균 속도를 계산
 * @param distance 미터 단위 거리
 * @param time 초 단위 시간
 * @returns km/h 단위 평균 속도
 */
export const calculateAverageSpeed = (distance: number, time: number): number => {
  if (time <= 0) return 0;
  
  const distanceKm = distance / 1000;
  const timeHours = time / 3600;
  
  return distanceKm / timeHours;
};

/**
 * 칼로리 소모량 계산 (대략적)
 * @param distance 미터 단위 거리
 * @param weight 체중 (kg)
 * @returns 소모 칼로리 (kcal)
 */
export const calculateCalories = (distance: number, weight: number = 70): number => {
  // 걷기 시 약 0.5 kcal/kg/km 소모 (대략적 계산)
  const distanceKm = distance / 1000;
  return Math.round(distanceKm * weight * 0.5);
};

/**
 * 날짜를 읽기 쉬운 형식으로 변환
 * @param dateString ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
};

/**
 * 시간을 읽기 쉬운 형식으로 변환
 * @param dateString ISO 날짜 문자열
 * @returns 포맷된 시간 문자열
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 산책 유형별 라벨 반환
 * @param walkType 산책 유형
 * @returns 표시용 라벨
 */
export const getWalkTypeLabel = (walkType: string): string => {
  switch (walkType) {
    case 'PERSONAL':
      return '개인 산책';
    case 'REGISTERED_TRAIL':
      return '등록된 산책로';
    case 'UPLOADED_TRAIL':
      return '업로드된 산책로';
    default:
      return '알 수 없음';
  }
};

/**
 * 산책 유형별 아이콘 반환
 * @param walkType 산책 유형
 * @returns 아이콘 이모지
 */
export const getWalkTypeIcon = (walkType: string): string => {
  switch (walkType) {
    case 'PERSONAL':
      return '🚶‍♂️';
    case 'REGISTERED_TRAIL':
      return '🗺️';
    case 'UPLOADED_TRAIL':
      return '📤';
    default:
      return '❓';
  }
};

/**
 * 산책 유형별 색상 클래스 반환
 * @param walkType 산책 유형
 * @returns Tailwind CSS 클래스
 */
export const getWalkTypeColor = (walkType: string): string => {
  switch (walkType) {
    case 'PERSONAL':
      return 'bg-blue-100 text-blue-800';
    case 'REGISTERED_TRAIL':
      return 'bg-green-100 text-green-800';
    case 'UPLOADED_TRAIL':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * WalkRecord에서 산책 유형을 판단
 * @param walk 산책 기록
 * @returns 산책 유형
 */
export const getWalkTypeFromRecord = (walk: { trailId: number | null; isUploaded: boolean }): 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL' => {
  if (walk.trailId === null) {
    return 'PERSONAL';
  } else if (walk.isUploaded) {
    return 'UPLOADED_TRAIL';
  } else {
    return 'REGISTERED_TRAIL';
  }
};

/**
 * WalkDetail을 WalkRecord로 변환
 * @param detail WalkDetail 객체
 * @returns WalkRecord 객체
 */
export const convertWalkDetailToRecord = (detail: WalkDetail): WalkRecord => {
  return {
    walkId: detail.walkId,
    trailId: detail.trailId,
    eventId: detail.eventId,
    eventTime: detail.eventTime,
    trailImageId: detail.trailImageId,
    routeImageUrl: detail.routeImageUrl,
    totalDistance: detail.totalDistance,
    totalTime: detail.totalTime.toString(), // 숫자를 문자열로 변환
    pace: detail.pace.toString(), // 숫자를 문자열로 변환
    title: detail.title,
    isUploaded: detail.isUploaded
  };
};

/**
 * 안전한 문자열을 정수로 변환
 * @param value 변환할 문자열
 * @param fallback 기본값 (기본값: 0)
 * @returns 변환된 정수 또는 기본값
 */
export const safeParseInt = (value: string | number, fallback: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value;
  }
  
  if (!value || value.trim() === '') {
    return fallback;
  }
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * 안전한 문자열을 실수로 변환
 * @param value 변환할 문자열
 * @param fallback 기본값 (기본값: 0)
 * @returns 변환된 실수 또는 기본값
 */
export const safeParseFloat = (value: string | number, fallback: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value;
  }
  
  if (!value || value.trim() === '') {
    return fallback;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * WalkRecord의 totalTime을 안전하게 숫자로 변환
 * @param totalTime totalTime 문자열
 * @returns 변환된 숫자 (기본값: 0)
 */
export const safeParseTotalTime = (totalTime: string): number => {
  return safeParseInt(totalTime, 0);
};

/**
 * WalkRecord의 pace를 안전하게 숫자로 변환
 * @param pace pace 문자열
 * @returns 변환된 숫자 (기본값: 0)
 */
export const safeParsePace = (pace: string): number => {
  return safeParseFloat(pace, 0);
}; 
