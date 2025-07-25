// 산책 기록 데이터 타입
export interface WalkRecord {
  walkId: number;
  memberId: number;
  date: string; // yyyy-MM-dd
  startedAt: string; // ISO 8601 형식
  endedAt: string; // ISO 8601 형식
  totalDistance: number; // km 단위
  totalTime: string; // hh:mm:ss 형식
  pace: string; // mm:ss/km 형식
  locationName: string;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  httpStatus: number;
  message: string;
  data: T;
}

// 산책 기록 목록 조회 응답
export interface WalkRecordsResponse extends ApiResponse<WalkRecord[]> {}

// 산책 기록 상세 조회 응답
export interface WalkRecordDetailResponse extends ApiResponse<WalkRecord> {}

// 산책 기록 등록 요청 (필요시)
export interface CreateWalkRecordRequest {
  memberId: number;
  date: string;
  startedAt: string;
  endedAt: string;
  totalDistance: number;
  totalTime: string;
  pace: string;
  locationName: string;
}

// 산책 기록 등록 응답
export interface CreateWalkRecordResponse extends ApiResponse<WalkRecord> {}

// API 에러 응답
export interface ApiErrorResponse {
  httpStatus: number;
  message: string;
  error?: string;
  timestamp?: string;
} 
