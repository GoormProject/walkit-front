import React from 'react';
import { useWalkStore } from '@/features/walk/walkSlice';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { toast } from 'sonner';
import type { WalkCreateRequest } from '@/types/walk';
import { calculateDistance as calculateCoordinateDistance } from '@/utils/converter/pathConverter';

interface WalkControlPanelProps {
  pathPositions: kakao.maps.LatLng[];
}

export const WalkControlPanel: React.FC<WalkControlPanelProps> = ({ 
  pathPositions 
}) => {
  const {
    currentWalk,
    isLoading,
    actions: walkActions,
  } = useWalkStore();
  
  const { position, error } = useGPSStore();

  // 총 거리 계산
  const calculateTotalDistance = (positions: kakao.maps.LatLng[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      totalDistance += calculateCoordinateDistance(
        { lat: prev.getLat(), lng: prev.getLng() },
        { lat: curr.getLat(), lng: curr.getLng() }
      );
    }
    return totalDistance;
  };

  // 산책 시작
  const handleStartWalk = async () => {
    try {
      await walkActions.startWalk();
      toast.success('산책을 시작합니다!');
    } catch (error) {
      toast.error('산책 시작에 실패했습니다.');
    }
  };

  // 산책 일시정지
  const handlePauseWalk = async () => {
    try {
      await walkActions.pauseWalk();
      toast.success('산책을 일시정지합니다.');
    } catch (error) {
      toast.error('산책 일시정지에 실패했습니다.');
    }
  };

  // 산책 재개
  const handleResumeWalk = async () => {
    try {
      await walkActions.resumeWalk();
      toast.success('산책을 재개합니다.');
    } catch (error) {
      toast.error('산책 재개에 실패했습니다.');
    }
  };

  // 산책 종료
  const handleEndWalk = async () => {
    try {
      const path = pathPositions.map(pos => [pos.getLng(), pos.getLat()]);
      await walkActions.endWalk(path);
      toast.success('산책을 종료합니다.');
    } catch (error) {
      toast.error('산책 종료에 실패했습니다.');
    }
  };

  // 산책 기록 등록
  const handleRegisterWalk = async () => {
    if (!currentWalk.walkId || !currentWalk.eventId) {
      toast.error('진행 중인 산책 정보가 완전하지 않습니다.');
      return;
    }
    
    if (pathPositions.length === 0) {
      toast.error('경로 정보가 없습니다.');
      return;
    }

    const totalDistance = calculateTotalDistance(pathPositions);
    const totalTime = currentWalk.startTime 
      ? Math.floor((Date.now() - new Date(currentWalk.startTime).getTime()) / 1000)
      : 0;

    const walkData: WalkCreateRequest = {
      walkId: currentWalk.walkId,
      walkTitle: `산책 기록 - ${new Date().toLocaleDateString()}`,
      totalDistance: Math.round(totalDistance),
      totalTime: totalTime,
      pace: totalTime > 0 ? totalDistance / totalTime : 0,
      path: pathPositions.map(pos => [pos.getLng(), pos.getLat()]),
      startPoint: [pathPositions[0].getLng(), pathPositions[0].getLat()],
      eventId: currentWalk.eventId,
      eventType: 'END',
    };

    try {
      await walkActions.createWalk(walkData);
      toast.success('산책 기록이 등록되었습니다!');
    } catch (error) {
      toast.error('산책 기록 등록에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">🚶‍♂️ 산책 컨트롤</h2>
      
      {/* 상태 표시 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* GPS 상태 */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs">
          {error ? (
            <span className="text-red-500">❌ GPS 오류</span>
          ) : position ? (
            <span className="text-green-500">✅ GPS 연결됨</span>
          ) : (
            <span className="text-gray-500">⏳ GPS 대기중</span>
          )}
        </div>

        {/* 산책 상태 */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs">
          {currentWalk.status === 'idle' && (
            <span className="text-gray-500">⏳ 대기중</span>
          )}
          {currentWalk.status === 'walking' && (
            <span className="text-green-500">🚶 산책중</span>
          )}
          {currentWalk.status === 'paused' && (
            <span className="text-yellow-500">⏸️ 일시정지</span>
          )}
        </div>

        {/* 경로 정보 */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs">
          <span className="text-blue-500">📍 {pathPositions.length}개 포인트</span>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={handleStartWalk}
          disabled={isLoading || currentWalk.status === 'walking'}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '시작 중...' : '산책 시작'}
        </button>
        <button
          onClick={handlePauseWalk}
          disabled={isLoading || currentWalk.status !== 'walking'}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '일시정지 중...' : '일시정지'}
        </button>
        <button
          onClick={handleResumeWalk}
          disabled={isLoading || currentWalk.status !== 'paused'}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '재개 중...' : '재개'}
        </button>
        <button
          onClick={handleEndWalk}
          disabled={isLoading || currentWalk.status === 'idle'}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '종료 중...' : '산책 종료'}
        </button>
        <button
          onClick={handleRegisterWalk}
          disabled={isLoading || !currentWalk.walkId}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium col-span-2"
        >
          {isLoading ? '등록 중...' : '산책 기록 등록'}
        </button>
      </div>

      {/* 현재 산책 정보 */}
      {currentWalk.walkId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">현재 산책 정보</h3>
          <div className="text-sm text-blue-600 space-y-1">
            <p>Walk ID: {currentWalk.walkId}</p>
            <p>Event ID: {currentWalk.eventId}</p>
            <p>상태: {currentWalk.status}</p>
            <p>경로 포인트: {currentWalk.path.length}개</p>
            {currentWalk.startTime && (
              <p>시작 시간: {new Date(currentWalk.startTime).toLocaleString()}</p>
            )}
            {pathPositions.length > 1 && (
              <p>총 거리: {(calculateTotalDistance(pathPositions) / 1000).toFixed(2)}km</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 
