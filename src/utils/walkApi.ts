import type {
  WalkStartApiResponse,
  WalkEventApiResponse,
  WalkCreateApiResponse,
  WalkDeleteApiResponse,
  WalkListResponse,
  WalkDetailResponse,
  WalkCreateRequest,
  WalkListRequest,
} from '../types/walk';
import { calculateCalories } from './walkUtils';

/**
 * API 호출 헤더 생성
 */
const getHeaders = () => {
  // 쿠키 기반 인증을 사용하므로 Authorization 헤더는 제거
  // credentials: 'include'로 쿠키가 자동으로 전송됨
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

/**
 * 쿼리 파라미터를 URL 문자열로 변환
 */
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * 산책 시작 API
 */
export const startWalk = async (): Promise<WalkStartApiResponse> => {
  console.log('🚀 실제 산책 시작 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/start`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    throw new Error(`산책 시작 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 일시정지 API
 */
export const pauseWalk = async (walkId: number): Promise<WalkEventApiResponse> => {
  console.log('⏸️ 실제 산책 일시정지 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/pause`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    throw new Error(`산책 일시정지 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 재개 API
 */
export const resumeWalk = async (walkId: number): Promise<WalkEventApiResponse> => {
  console.log('▶️ 실제 산책 재개 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/resume`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    throw new Error(`산책 재개 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 종료 API
 */
export const endWalk = async (walkId: number, path: number[][]): Promise<WalkEventApiResponse> => {
  console.log('🏁 실제 산책 종료 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/end`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    throw new Error(`산책 종료 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 기록 등록 API
 */
export const createWalk = async (walkData: WalkCreateRequest): Promise<WalkCreateApiResponse> => {
  console.log('📝 실제 산책 기록 등록 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/new`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
    body: JSON.stringify(walkData),
  });

  if (!response.ok) {
    throw new Error(`산책 기록 등록 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 기록 목록 조회 API (페이징 및 필터링 지원)
 */
export const getWalkList = async (params?: WalkListRequest): Promise<WalkListResponse> => {
  console.log('📋 실제 산책 기록 목록 API 호출');
  
  // Mock API 사용 (실제 API 구현 전까지)
  const { getMockWalkList } = await import('./mockWalkApi');
  const mockData = await getMockWalkList();
  
  // 필터링 로직 (실제로는 백엔드에서 처리)
  let filteredData = mockData;
  
  if (params?.walkType && params.walkType !== 'ALL') {
    filteredData = mockData.filter(walk => {
      const walkType = walk.trailId === null ? 'PERSONAL' : (walk.isUploaded ? 'UPLOADED_TRAIL' : 'REGISTERED_TRAIL');
      return walkType === params.walkType;
    });
  }
  
  if (params?.startDate) {
    filteredData = filteredData.filter(walk => 
      new Date(walk.eventTime) >= new Date(params.startDate!)
    );
  }
  
  if (params?.endDate) {
    filteredData = filteredData.filter(walk => 
      new Date(walk.eventTime) <= new Date(params.endDate!)
    );
  }
  
  // 페이징 로직 (실제로는 백엔드에서 처리)
  const page = params?.page || 0;
  const size = params?.size || 10;
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  return {
    httpStatus: 200,
    message: '산책 기록 목록 조회 성공',
    data: paginatedData
  };
};

/**
 * 산책 기록 상세 조회 API
 */
export const getWalkDetail = async (walkId: number): Promise<WalkDetailResponse> => {
  console.log('📄 실제 산책 기록 상세 조회 API 호출');
  
  // Mock API 사용 (실제 API 구현 전까지)
  const { getMockWalkDetail } = await import('./mockWalkApi');
  const mockData = await getMockWalkDetail(walkId);
  
  if (!mockData) {
    throw new Error(`산책 기록을 찾을 수 없습니다: ${walkId}`);
  }
  
  // WalkRecord를 WalkDetail로 변환
  const walkType: 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL' = 
    mockData.trailId === null ? 'PERSONAL' : (mockData.isUploaded ? 'UPLOADED_TRAIL' : 'REGISTERED_TRAIL');
  
  const walkDetail = {
    ...mockData,
    totalTime: parseInt(mockData.totalTime, 10), // 문자열을 숫자로 변환
    pace: parseFloat(mockData.pace), // 문자열을 숫자로 변환
    walkType,
    startPoint: [126.9780, 37.5665], // Mock 데이터
    endPoint: [126.9820, 37.5705], // Mock 데이터
    path: [[126.9780, 37.5665], [126.9790, 37.5675], [126.9800, 37.5685], [126.9810, 37.5695], [126.9820, 37.5705]], // Mock 데이터
    calories: calculateCalories(mockData.totalDistance),
    averageSpeed: parseFloat(mockData.totalTime) > 0 ? (mockData.totalDistance / 1000) / (parseFloat(mockData.totalTime) / 3600) : 0,
    maxSpeed: (mockData.totalDistance / 1000) / (parseFloat(mockData.totalTime) / 3600) * 1.2, // Mock 데이터
    elevationGain: 50, // Mock 데이터
    elevationLoss: 30 // Mock 데이터
  };
  
  return {
    httpStatus: 200,
    message: '산책 기록 상세 조회 성공',
    data: walkDetail
  };
};

/**
 * 산책 기록 삭제 API
 */
export const deleteWalk = async (walkId: number): Promise<WalkDeleteApiResponse> => {
  console.log('🗑️ 실제 산책 기록 삭제 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    throw new Error(`산책 기록 삭제 실패: ${response.status}`);
  }

  return response.json();
}; 
