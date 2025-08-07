// 산책 기록 데이터 타입 (API 스펙에 맞게 업데이트)
export interface WalkRecord {
  walkId: number;
  trailId: number | null;
  eventId: number;
  eventTime: string; // 산책 종료 시각
  trailImageId?: number;
  routeImageUrl?: string;
  totalDistance: number; // m 단위
  totalTime: string; // 문자열로 받음 (API 스펙에 따름)
  pace: string; // 문자열로 받음 (API 스펙에 따름)
  title: string; // trailId가 있으면 산책로 제목, 없으면 walkTitle
  isUploaded: boolean;
}

// 페이징 정보
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 산책 기록 목록 조회 요청
export interface WalkListRequest {
  page?: number;
  size?: number;
  walkType?: 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL' | 'ALL';
  startDate?: string; // YYYY-MM-DD 형식
  endDate?: string; // YYYY-MM-DD 형식
}

// 산책 기록 상세 정보
export interface WalkDetail {
  walkId: number;
  trailId: number | null;
  eventId: number;
  eventTime: string;
  trailImageId?: number;
  routeImageUrl?: string;
  totalDistance: number;
  totalTime: number;
  pace: number;
  title: string;
  isUploaded: boolean;
  walkType: 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL';
  startPoint: number[]; // [lng, lat]
  endPoint: number[]; // [lng, lat]
  path: number[][]; // 좌표 배열
  calories?: number; // 소모 칼로리
  averageSpeed?: number; // 평균 속도 (km/h)
  maxSpeed?: number; // 최고 속도 (km/h)
  elevationGain?: number; // 고도 상승 (m)
  elevationLoss?: number; // 고도 하강 (m)
}

// 산책 시작 응답
export interface WalkStartResponse {
  walkId: number;
  eventId: number;
  eventType: 'START';
  eventTime: string;
}

// 산책 이벤트 응답 (일시정지, 재개, 종료)
export interface WalkEventResponse {
  eventId: number;
  eventType: 'PAUSE' | 'RESUME' | 'END';
  eventTime: string;
  totalTime?: number; // 종료 시에만 포함
  totalDistance?: number; // 종료 시에만 포함
  pace?: number; // 종료 시에만 포함
}

// 산책 등록 요청
export interface WalkCreateRequest {
  walkId: number;
  walkTitle: string;
  totalTime: number;
  totalDistance: number;
  pace: number;
  path: number[][]; // 좌표 배열 [[lng, lat], [lng, lat], ...]
  startPoint: number[]; // [lng, lat]
  eventId: number;
  eventType: 'END';
  routeUrl?: string;
  walkType?: 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL';
}

// 산책 등록 응답
export interface WalkCreateResponse {
  walkId: number;
}

// 산책 삭제 응답
export interface WalkDeleteResponse {
  walkId: number;
  memberId: number;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  httpStatus: number;
  message: string;
  data: T;
}

// 산책 기록 목록 조회 응답
export interface WalkListResponse extends ApiResponse<WalkRecord[]> {}

// 산책 기록 상세 조회 응답
export interface WalkDetailResponse extends ApiResponse<WalkDetail> {}

// 산책 시작 응답
export interface WalkStartApiResponse extends ApiResponse<WalkStartResponse> {}

// 산책 이벤트 응답
export interface WalkEventApiResponse extends ApiResponse<WalkEventResponse> {}

// 산책 등록 응답
export interface WalkCreateApiResponse extends ApiResponse<WalkCreateResponse> {}

// 산책 삭제 응답
export interface WalkDeleteApiResponse extends ApiResponse<WalkDeleteResponse> {}

// API 에러 응답
export interface ApiErrorResponse {
  httpStatus: number;
  message: string;
  error?: string;
  timestamp?: string;
}

// 산책 상태 Enum
export enum WalkStatus {
  IDLE = 'idle',
  WALKING = 'walking',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

// 현재 진행 중인 산책 정보
export interface CurrentWalk {
  walkId: number | null;
  eventId: number | null;
  status: WalkStatus;
  startTime: string | null;
  path: number[][];
}

// 산책 통계 정보
export interface WalkStatistics {
  totalWalks: number;
  totalDistance: number; // m 단위
  totalTime: number; // 초 단위
  averagePace: number;
  averageDistance: number; // m 단위
  averageTime: number; // 초 단위
  personalWalks: number;
  registeredTrailWalks: number;
  uploadedTrailWalks: number;
} 
