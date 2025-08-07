import type { GeoJSONFeatureCollection } from '../types/trail';
import type { TrailListResponse, TrailResponse, TrailDetailResponse } from '../api/swagger-api';
import type { Trail } from '../types/trail';
import type { 
  WalkRecord,
  WalkListResponse,
  WalkStartApiResponse,
  WalkEventApiResponse,
  WalkCreateApiResponse,
  WalkDeleteApiResponse,
  WalkCreateRequest,
  WalkDetailResponse
} from '../types/walk';
// 임시로 비활성화 - walkApi.ts에서 처리
// 이 파일은 나중에 실제 API 구현 시 사용할 예정

export const getTrailPaths = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getWalkRecords = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getWalkRecordById = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const createWalkRecord = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getWalkPathById = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getWalkPaths = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getTrails = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

export const getTrailById = async () => {
  throw new Error('backendApi.ts는 임시로 비활성화되었습니다. walkApi.ts를 사용해주세요.');
};

/**
 * API 모드 정보 반환
 */
export const getApiModeInfo = () => {
  return {
    isMock: true, // 현재는 Mock 모드로 고정
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    environment: import.meta.env.MODE,
  };
}; 
