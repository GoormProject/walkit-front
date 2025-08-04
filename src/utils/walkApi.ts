import type {
  WalkStartApiResponse,
  WalkEventApiResponse,
  WalkCreateApiResponse,
  WalkDeleteApiResponse,
  WalkListResponse,
  WalkCreateRequest,
} from '../types/walk';

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
 * 산책 기록 목록 조회 API
 */
export const getWalkList = async (): Promise<WalkListResponse> => {
  console.log('📋 실제 산책 기록 목록 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include', // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    throw new Error(`산책 기록 목록 조회 실패: ${response.status}`);
  }

  return response.json();
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
