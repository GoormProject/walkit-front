import type { 
  WalkRecordsResponse, 
  WalkRecordDetailResponse, 
  WalkRecord,
  CreateWalkRecordRequest,
  CreateWalkRecordResponse,
  ApiErrorResponse,
  ApiResponse
} from '../types/walk';

/**
 * Mock 산책 기록 데이터
 */
const mockWalkRecords: WalkRecord[] = [
  {
    walkId: 12,
    memberId: 102,
    date: "2025-07-20",
    startedAt: "2025-07-20T08:30:00",
    endedAt: "2025-07-20T09:10:00",
    totalDistance: 3.7,
    totalTime: "00:40:00",
    pace: "10:48/km",
    locationName: "서울시 중구"
  },
  {
    walkId: 11,
    memberId: 102,
    date: "2025-07-18",
    startedAt: "2025-07-18T18:00:00",
    endedAt: "2025-07-18T18:30:00",
    totalDistance: 2.1,
    totalTime: "00:30:00",
    pace: "14:17/km",
    locationName: "서울시 강남구"
  },
  {
    walkId: 10,
    memberId: 102,
    date: "2025-07-15",
    startedAt: "2025-07-15T07:00:00",
    endedAt: "2025-07-15T08:15:00",
    totalDistance: 5.2,
    totalTime: "01:15:00",
    pace: "14:25/km",
    locationName: "서울시 마포구"
  },
  {
    walkId: 9,
    memberId: 102,
    date: "2025-07-12",
    startedAt: "2025-07-12T19:30:00",
    endedAt: "2025-07-12T20:00:00",
    totalDistance: 1.8,
    totalTime: "00:30:00",
    pace: "16:40/km",
    locationName: "서울시 서초구"
  }
];

/**
 * Mock API 응답 헬퍼 함수
 */
const createSuccessResponse = <T>(data: T, message: string): ApiResponse<T> => ({
  httpStatus: 200,
  message,
  data
});

const createErrorResponse = (status: number, message: string): ApiErrorResponse => ({
  httpStatus: status,
  message,
  timestamp: new Date().toISOString()
});

/**
 * 산책 기록 목록 조회 Mock API
 * GET /api/walks
 */
export const getWalkRecords = async (): Promise<WalkRecordsResponse> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 에러 시뮬레이션 (5% 확률)
  if (Math.random() < 0.05) {
    throw new Error('서버 연결에 실패했습니다.');
  }
  
  return createSuccessResponse(mockWalkRecords, "산책 기록 목록 조회 성공");
};

/**
 * 산책 기록 상세 조회 Mock API
 * GET /api/walks/{walkId}
 */
export const getWalkRecordById = async (walkId: string): Promise<WalkRecordDetailResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const walkIdNum = parseInt(walkId);
  const walkRecord = mockWalkRecords.find(record => record.walkId === walkIdNum);
  
  if (!walkRecord) {
    throw new Error(`산책 기록을 찾을 수 없습니다: ${walkId}`);
  }
  
  return createSuccessResponse(walkRecord, "산책 기록 상세 조회 완료");
};

/**
 * 산책 기록 등록 Mock API
 * POST /api/walks
 */
export const createWalkRecord = async (request: CreateWalkRecordRequest): Promise<CreateWalkRecordResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 새로운 산책 기록 생성
  const newWalkRecord: WalkRecord = {
    walkId: Math.max(...mockWalkRecords.map(r => r.walkId)) + 1,
    memberId: request.memberId,
    date: request.date,
    startedAt: request.startedAt,
    endedAt: request.endedAt,
    totalDistance: request.totalDistance,
    totalTime: request.totalTime,
    pace: request.pace,
    locationName: request.locationName
  };
  
  // Mock 데이터에 추가 (실제로는 데이터베이스에 저장)
  mockWalkRecords.unshift(newWalkRecord);
  
  return createSuccessResponse(newWalkRecord, "산책 기록 등록 완료");
};

/**
 * 산책 기록 삭제 Mock API
 * DELETE /api/walks/{walkId}
 */
export const deleteWalkRecord = async (walkId: string): Promise<ApiResponse<{ walkId: number }>> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const walkIdNum = parseInt(walkId);
  const index = mockWalkRecords.findIndex(record => record.walkId === walkIdNum);
  
  if (index === -1) {
    throw new Error(`산책 기록을 찾을 수 없습니다: ${walkId}`);
  }
  
  // Mock 데이터에서 제거
  mockWalkRecords.splice(index, 1);
  
  return createSuccessResponse({ walkId: walkIdNum }, "산책 기록 삭제 완료");
};

/**
 * 사용자별 산책 기록 조회 Mock API
 * GET /api/members/{memberId}/walks
 */
export const getWalkRecordsByMemberId = async (memberId: string): Promise<WalkRecordsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const memberIdNum = parseInt(memberId);
  const filteredRecords = mockWalkRecords.filter(record => record.memberId === memberIdNum);
  
  return createSuccessResponse(filteredRecords, "사용자별 산책 기록 조회 성공");
};

/**
 * 날짜별 산책 기록 조회 Mock API
 * GET /api/walks?date={date}
 */
export const getWalkRecordsByDate = async (date: string): Promise<WalkRecordsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const filteredRecords = mockWalkRecords.filter(record => record.date === date);
  
  return createSuccessResponse(filteredRecords, "날짜별 산책 기록 조회 성공");
}; 
