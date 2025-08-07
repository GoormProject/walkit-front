import type { WalkRecord } from '../types/walk';

/**
 * Mock 산책 기록 데이터 (API 스펙에 맞게 생성)
 */
const mockWalkRecords: WalkRecord[] = [
  {
    walkId: 12,
    trailId: 101,
    eventId: 111,
    eventTime: "2025-01-20T09:10:00",
    trailImageId: 366,
    routeImageUrl: "https://example.com/trail-image-1.jpg",
    totalDistance: 3765.35,
    totalTime: "3600",
    pace: "3.765",
    title: "일산호수공원",
    isUploaded: false
  },
  {
    walkId: 13,
    trailId: null,
    eventId: 124,
    eventTime: "2025-01-19T15:30:00",
    trailImageId: 367,
    routeImageUrl: "https://example.com/walk-image-1.jpg",
    totalDistance: 2150.25,
    totalTime: "1800",
    pace: "2.150",
    title: "2025-01-19의 산책 기록",
    isUploaded: false
  },
  {
    walkId: 14,
    trailId: 102,
    eventId: 133,
    eventTime: "2025-01-18T11:45:00",
    trailImageId: 368,
    routeImageUrl: "https://example.com/trail-image-2.jpg",
    totalDistance: 5200.75,
    totalTime: "5400",
    pace: "5.200",
    title: "내가 업로드한 산책기록",
    isUploaded: true
  },
  {
    walkId: 15,
    trailId: null,
    eventId: 145,
    eventTime: "2025-01-17T08:20:00",
    trailImageId: 369,
    routeImageUrl: "https://example.com/walk-image-2.jpg",
    totalDistance: 1800.50,
    totalTime: "1200",
    pace: "1.800",
    title: "2025-01-17의 산책 기록",
    isUploaded: false
  },
  {
    walkId: 16,
    trailId: 103,
    eventId: 156,
    eventTime: "2025-01-16T16:15:00",
    trailImageId: 370,
    routeImageUrl: "https://example.com/trail-image-3.jpg",
    totalDistance: 4200.00,
    totalTime: "4800",
    pace: "4.200",
    title: "한강공원 산책로",
    isUploaded: false
  }
];

/**
 * Mock 산책 기록 목록 조회
 */
export const getMockWalkList = async (): Promise<WalkRecord[]> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 에러 시뮬레이션 (5% 확률)
  if (Math.random() < 0.05) {
    throw new Error('서버 연결에 실패했습니다.');
  }
  
  return mockWalkRecords;
};

/**
 * Mock 산책 기록 상세 조회
 */
export const getMockWalkDetail = async (walkId: number): Promise<WalkRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const walk = mockWalkRecords.find(record => record.walkId === walkId);
  return walk || null;
};

/**
 * Mock 산책 기록 생성
 */
export const createMockWalkRecord = async (request: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 새로운 산책 기록 생성
  const newWalkRecord: WalkRecord = {
    walkId: mockWalkRecords.length > 0 ? Math.max(...mockWalkRecords.map(r => r.walkId)) + 1 : 1,
    trailId: null, // 개인 산책
    eventId: request.eventId || Date.now(),
    eventTime: new Date().toISOString(),
    trailImageId: undefined,
    routeImageUrl: undefined,
    totalDistance: request.totalDistance || 0,
    totalTime: request.totalTime?.toString() || "0",
    pace: request.pace?.toString() || "0",
    title: request.walkTitle || `산책 기록 ${new Date().toLocaleDateString()}`,
    isUploaded: false
  };
  
  // Mock 데이터에 추가
  mockWalkRecords.unshift(newWalkRecord);
  
  return {
    httpStatus: 200,
    message: "산책 기록 생성 성공",
    data: newWalkRecord
  };
};

/**
 * Mock 산책 기록 삭제
 */
export const deleteMockWalkRecord = async (walkId: number): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = mockWalkRecords.findIndex(record => record.walkId === walkId);
  
  if (index === -1) {
    throw new Error(`산책 기록을 찾을 수 없습니다: ${walkId}`);
  }
  
  // Mock 데이터에서 제거
  mockWalkRecords.splice(index, 1);
  
  return {
    httpStatus: 200,
    message: "산책 기록 삭제 성공",
    data: { walkId }
  };
}; 
