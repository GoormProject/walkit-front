import React from 'react';
import { useWalkStore } from '@/features/walk/walkSlice';
import { toast } from 'sonner';

// 시간 문자열을 분 단위로 변환 (HH:MM:SS → 분)
const parseTimeToMinutes = (timeString: string | number): number => {
  if (typeof timeString === 'number') {
    return Math.floor(timeString / 60);
  }
  
  if (typeof timeString === 'string') {
    // "00:00:30" 형식을 분으로 변환
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      return hours * 60 + minutes + Math.floor(seconds / 60);
    }
  }
  
  return 0;
};

// pace(분/km)를 시속(km/h)으로 변환
const convertPaceToSpeed = (pace: string | number): number => {
  if (typeof pace === 'string') {
    pace = parseFloat(pace);
  }
  
  if (typeof pace === 'number' && pace > 0) {
    // 분/킬로미터 → 시속(km/h) 변환
    // 1시간 = 60분이므로, 60 / pace = 시속
    return 60 / pace;
  }
  
  return 0;
};

export const WalkRecordsList: React.FC = () => {
  const {
    walkRecords,
    currentWalk,
    isLoading,
    error,
    actions: walkActions,
  } = useWalkStore();

  // 산책 기록 목록 조회
  const handleGetWalkRecords = async () => {
    try {
      await walkActions.getWalkRecords();
    } catch (error) {
      toast.error('산책 기록 조회에 실패했습니다.');
    }
  };

  // 산책 기록 삭제
  const handleDeleteWalk = async (walkId: number) => {
    try {
      await walkActions.deleteWalk(walkId);
      toast.success('산책 기록이 삭제되었습니다.');
    } catch (error) {
      toast.error('산책 기록 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white p-4 shadow-md max-h-80 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">산책 기록 목록</h2>
        <button
          onClick={handleGetWalkRecords}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '조회중...' : '새로고침'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 산책 기록 목록 */}
      <div className="overflow-y-auto max-h-32">
        {walkRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-4">산책 기록이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {walkRecords.map((record) => (
              <div
                key={record.walkId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{record.title}</h3>
                  <p className="text-sm text-gray-600">
                    거리: {record.totalDistance ? record.totalDistance.toFixed(3) : '0.000'}km | 
                    시간: {record.totalTime ? parseTimeToMinutes(record.totalTime) : 0}분 | 
                    속도: {record.pace ? convertPaceToSpeed(record.pace).toFixed(1) : 'N/A'}km/h
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.eventTime).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteWalk(record.walkId)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium ml-2 flex-shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 현재 산책 정보 */}
      {currentWalk.walkId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800">현재 산책 정보</h3>
          <p className="text-sm text-blue-600">
            Walk ID: {currentWalk.walkId} | 
            Event ID: {currentWalk.eventId} | 
            상태: {currentWalk.status} | 
            경로 포인트: {currentWalk.path.length}개
          </p>
          {currentWalk.startTime && (
            <p className="text-sm text-blue-600">
              시작 시간: {new Date(currentWalk.startTime).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 
