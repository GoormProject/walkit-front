import type {
  WalkStartApiResponse,
  WalkEventApiResponse,
  WalkCreateApiResponse,
  WalkDeleteApiResponse,
  WalkListResponse,
  WalkCreateRequest,
} from '../types/walk';

/**
 * 환경 설정에 따른 API 모드 결정
 */
const isMockMode = () => {
  return import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API === 'true';
};

/**
 * API 호출 헤더 생성
 */
const getHeaders = () => {
  // localStorage에서 토큰 확인
  let token = localStorage.getItem('accessToken');
  
  // localStorage에 토큰이 없으면 쿠키에서 확인
  if (!token) {
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('ACCESS_TOKEN=')
    );
    
    if (accessTokenCookie) {
      token = accessTokenCookie.split('=')[1];
      console.log('🍪 쿠키에서 토큰 사용:', token);
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * 산책 시작 API
 */
export const startWalk = async (): Promise<WalkStartApiResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 시작 API 모드로 실행 중');
    // Mock 응답
    return {
      httpStatus: 200,
      message: '산책 기록 시작 성공',
      data: {
        walkId: 101,
        eventId: 101,
        eventType: 'START',
        eventTime: new Date().toISOString(),
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/start`, {
    method: 'POST',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 일시정지 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 일시정지 성공',
      data: {
        eventId: 102,
        eventType: 'PAUSE',
        eventTime: new Date().toISOString(),
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/pause`, {
    method: 'PUT',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 재개 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 재개 성공',
      data: {
        eventId: 103,
        eventType: 'RESUME',
        eventTime: new Date().toISOString(),
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/resume`, {
    method: 'PUT',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 종료 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 종료 성공',
      data: {
        eventId: 104,
        eventType: 'END',
        eventTime: new Date().toISOString(),
        totalTime: 3600,
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}/end`, {
    method: 'PUT',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 등록 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 등록 성공',
      data: {
        walkId: walkData.walkId,
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/new`, {
    method: 'POST',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 목록 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 목록 조회 성공',
      data: [
        {
          walkId: 12,
          trailId: 101,
          eventId: 111,
          eventTime: '2025-07-20T09:10:00',
          trailImageId: 366,
          routeImageUrl: 'https://example.com/image1.jpg',
          totalDistance: 3765.35,
          totalTime: 3600,
          pace: 3.765,
          title: '일산호수공원',
          isUploaded: false,
        },
        {
          walkId: 13,
          trailId: null,
          eventId: 124,
          eventTime: '2025-07-20T09:10:00',
          trailImageId: 367,
          routeImageUrl: 'https://example.com/image2.jpg',
          totalDistance: 3765.35,
          totalTime: 3600,
          pace: 3.765,
          title: '2025-07-20의 산책 기록',
          isUploaded: false,
        },
      ],
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks`, {
    method: 'GET',
    headers: getHeaders(),
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
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 삭제 API 모드로 실행 중');
    return {
      httpStatus: 200,
      message: '산책 기록 삭제 완료',
      data: {
        walkId,
        memberId: 102,
      },
    };
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`산책 기록 삭제 실패: ${response.status}`);
  }

  return response.json();
}; 
