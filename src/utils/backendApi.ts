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
  WalkCreateRequest
} from '../types/walk';
import { getTrailPaths as getMockTrailPaths } from './mockTrailApi';
import { 
  getWalkRecords as getMockWalkRecords,
  getWalkRecordById as getMockWalkRecordById,
  createWalkRecord as createMockWalkRecord,
  getWalkPathById as getMockWalkPathById,
  getWalkPaths as getMockWalkPaths
} from './mockWalkApi';

/**
 * 환경 설정에 따른 API 모드 결정
 */
const isMockMode = () => {
  // 개발 환경에서 Mock 모드 활성화
  return import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API === 'true';
};

/**
 * 실제 API 호출 함수 (백엔드 구현 후 사용)
 */
const getRealTrailPaths = async (): Promise<GeoJSONFeatureCollection> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trail-paths`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 환경에 따라 적절한 API 함수 반환
 */
export const getTrailPaths = async (): Promise<GeoJSONFeatureCollection> => {
  if (isMockMode()) {
    console.log('🔧 Mock API 모드로 실행 중');
    return getMockTrailPaths();
  } else {
    console.log('🚀 실제 API 모드로 실행 중');
    return getRealTrailPaths();
  }
};

/**
 * 실제 산책 기록 목록 조회 API (백엔드 구현 후 사용)
 */
const getRealWalkRecords = async (): Promise<WalkRecordsResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 실제 산책 기록 상세 조회 API (백엔드 구현 후 사용)
 */
const getRealWalkRecordById = async (walkId: string): Promise<WalkRecordDetailResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks/${walkId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 실제 산책 기록 등록 API (백엔드 구현 후 사용)
 */
const createRealWalkRecord = async (request: CreateWalkRecordRequest): Promise<CreateWalkRecordResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/walks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 기록 목록 조회 (환경에 따라 Mock/실제 API 선택)
 */
export const getWalkRecords = async (): Promise<WalkRecordsResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 API 모드로 실행 중');
    return getMockWalkRecords();
  } else {
    console.log('🚀 실제 산책 기록 API 모드로 실행 중');
    return getRealWalkRecords();
  }
};

/**
 * 산책 기록 상세 조회 (환경에 따라 Mock/실제 API 선택)
 */
export const getWalkRecordById = async (walkId: string): Promise<WalkRecordDetailResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 상세 API 모드로 실행 중');
    return getMockWalkRecordById(walkId);
  } else {
    console.log('🚀 실제 산책 기록 상세 API 모드로 실행 중');
    return getRealWalkRecordById(walkId);
  }
};

/**
 * 산책 기록 등록 (환경에 따라 Mock/실제 API 선택)
 */
export const createWalkRecord = async (request: CreateWalkRecordRequest): Promise<CreateWalkRecordResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 기록 등록 API 모드로 실행 중');
    return createMockWalkRecord(request);
  } else {
    console.log('🚀 실제 산책 기록 등록 API 모드로 실행 중');
    return createRealWalkRecord(request);
  }
};

/**
 * 실제 산책 경로 상세 조회 API (백엔드 구현 후 사용)
 */
const getRealWalkPathById = async (pathId: string): Promise<WalkPathDetailResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paths/${pathId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 실제 산책 경로 목록 조회 API (백엔드 구현 후 사용)
 */
const getRealWalkPaths = async (): Promise<WalkPathsResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paths`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 산책 경로 상세 조회 (환경에 따라 Mock/실제 API 선택)
 */
export const getWalkPathById = async (pathId: string): Promise<WalkPathDetailResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 경로 상세 API 모드로 실행 중');
    return getMockWalkPathById(pathId);
  } else {
    console.log('🚀 실제 산책 경로 상세 API 모드로 실행 중');
    return getRealWalkPathById(pathId);
  }
};

/**
 * 산책 경로 목록 조회 (환경에 따라 Mock/실제 API 선택)
 */
export const getWalkPaths = async (): Promise<WalkPathsResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock 산책 경로 목록 API 모드로 실행 중');
    return getMockWalkPaths();
  } else {
    console.log('🚀 실제 산책 경로 목록 API 모드로 실행 중');
    return getRealWalkPaths();
  }
};

/**
 * API 상태 확인 함수
 */
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    if (isMockMode()) {
      return true; // Mock 모드에서는 항상 성공
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    console.error('API 상태 확인 실패:', error);
    return false;
  }
};

/**
 * API 모드 정보 반환
 */
export const getApiModeInfo = () => {
  return {
    isMock: isMockMode(),
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    environment: import.meta.env.MODE,
  };
};

/**
 * 실제 산책로 목록 조회 API
 */
const getRealTrails = async (): Promise<TrailListResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`산책로 API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * Mock 산책로 데이터 (개발용)
 */
const getMockTrails = async (): Promise<TrailListResponse> => {
  // 개발용 Mock 데이터
  const mockTrails: TrailResponse[] = [
    {
      id: 1,
      name: '한강공원 산책로',
      location: '서울특별시 영등포구',
      length: 5.2,
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: 2,
      name: '남산 둘레길',
      location: '서울특별시 중구',
      length: 3.1,
      rating: 4.5,
      reviewCount: 28,
    },
    {
      id: 3,
      name: '북서울꿈의숲',
      location: '서울특별시 강북구',
      length: 2.8,
      rating: 4.3,
      reviewCount: 22,
    },
  ];

  return {
    status: 200,
    message: '산책로 리스트 조회 성공',
    trails: mockTrails,
    totalElements: mockTrails.length,
  };
};

/**
 * 환경에 따라 적절한 산책로 API 함수 반환
 */
export const getTrails = async (): Promise<TrailListResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock API 모드로 산책로 조회');
    return getMockTrails();
  } else {
    console.log('🚀 실제 API 모드로 산책로 조회');
    return getRealTrails();
  }
};

/**
 * 실제 산책로 상세 조회 API
 */
const getRealTrailById = async (trailId: number): Promise<TrailDetailResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails/${trailId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`산책로 상세 조회 API 호출 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * Mock 산책로 상세 데이터 (개발용)
 */
const getMockTrailById = async (trailId: number): Promise<TrailDetailResponse> => {
  // 개발용 Mock 데이터
  const mockTrailDetail: TrailDetailResponse = {
    httpStatus: 200,
    message: '단건 조회 성공',
    data: {
      title: '남산 둘레길',
      description: '남산 둘레기를 돌아보는 초급 코스입니다.',
      location: '서울 중구 남산공원',
      length: 3.8,
      routeImageUrl: 'https://example.com/images/namsan-trail.png',
      reviewCount: 25,
      rating: 4.3,
      pathId: trailId,
      startPoint: [126.75791835403612, 37.662510637017874],
      path: [
        [126.75791835403612, 37.662510637017874],
        [126.75790151956403, 37.66262761454681],
        [126.75789029658108, 37.662723861742975],
        [126.75790900155192, 37.66283343532169],
        [126.75795763447428, 37.662935605134706],
        [126.75809792174988, 37.66306886989648],
        [126.75818770560676, 37.66312069501714]
      ]
    }
  };

  return mockTrailDetail;
};

/**
 * 환경에 따라 적절한 산책로 상세 조회 API 함수 반환
 */
export const getTrailById = async (trailId: number): Promise<TrailDetailResponse> => {
  if (isMockMode()) {
    console.log('🔧 Mock API 모드로 산책로 상세 조회:', trailId);
    return getMockTrailById(trailId);
  } else {
    console.log('🚀 실제 API 모드로 산책로 상세 조회:', trailId);
    return getRealTrailById(trailId);
  }
}; 
