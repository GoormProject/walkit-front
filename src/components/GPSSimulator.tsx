import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createHongdaeToSinchonPath } from '@/utils/mockGPSData';
import { useGPSStore } from '@/features/gps/gpsSlice';

interface GPSSimulatorProps {
  onPositionUpdate?: (position: kakao.maps.LatLng) => void;
}

export const GPSSimulator: React.FC<GPSSimulatorProps> = ({ onPositionUpdate }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [simulationData, setSimulationData] = useState<ReturnType<typeof createHongdaeToSinchonPath> | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  const { actions: gpsActions } = useGPSStore();

  // onPositionUpdate 콜백을 ref로 최신 상태 유지
  useEffect(() => {
    onPositionUpdateRef.current = onPositionUpdate;
  }, [onPositionUpdate]);

  // 시뮬레이션 데이터 초기화
  useEffect(() => {
    const data = createHongdaeToSinchonPath();
    setSimulationData(data);
    console.log('🎯 가상 GPS 경로 생성:', {
      총거리: `${(data.totalDistance / 1000).toFixed(2)}km`,
      총시간: `${Math.floor(data.totalTime / 60)}분 ${Math.floor(data.totalTime % 60)}초`,
      포인트수: data.path.length,
      간격: `${data.intervalTime}초`
    });
  }, []);

  // 시뮬레이션 시작
  const startSimulation = useCallback(() => {
    if (!simulationData) return;

    console.log('🚀 시뮬레이션 시작 - 기존 타이머 정리');
    
    // 기존 타이머가 있다면 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsSimulating(true);
    setCurrentIndex(0);
    setProgress(0);

    // 첫 번째 위치로 이동
    const firstPosition = simulationData.path[0];
    const kakaoPosition = new kakao.maps.LatLng(firstPosition.lat, firstPosition.lng);
    
    // GPS Store 업데이트
    gpsActions.setPosition(kakaoPosition);

    // 콜백 호출
    onPositionUpdate?.(kakaoPosition);

    // 5초마다 다음 위치로 이동
    console.log('⏰ 타이머 설정:', simulationData.intervalTime * 1000, 'ms');
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex >= simulationData.path.length) {
          // 시뮬레이션 완료
          setIsSimulating(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prevIndex;
        }

        const position = simulationData.path[nextIndex];
        const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
        
        // GPS Store 업데이트
        gpsActions.setPosition(kakaoPosition);

        // 콜백 호출
        console.log(`🎯 GPSSimulator 콜백 호출: ${nextIndex + 1}/${simulationData.path.length}`);
        onPositionUpdateRef.current?.(kakaoPosition);

        // 진행률 업데이트
        const newProgress = (nextIndex / (simulationData.path.length - 1)) * 100;
        setProgress(newProgress);

        console.log(`📍 가상 GPS 위치 업데이트: ${nextIndex + 1}/${simulationData.path.length} (${newProgress.toFixed(1)}%)`);
        
        return nextIndex;
      });
    }, simulationData.intervalTime * 1000);
  }, [simulationData, gpsActions]);

  // 시뮬레이션 중지
  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 시뮬레이션 리셋
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setCurrentIndex(0);
    setProgress(0);
  }, [stopSimulation]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!simulationData) {
    return <div className="text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">🎯 가상 GPS 시뮬레이터</h3>
        <div className="flex items-center gap-2">
          {isSimulating ? (
            <span className="text-green-500 text-sm">🔄 시뮬레이션 중</span>
          ) : (
            <span className="text-gray-500 text-sm">⏸️ 대기중</span>
          )}
        </div>
      </div>

      {/* 경로 정보 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">총 거리</div>
          <div className="text-lg font-bold text-blue-600">
            {(simulationData.totalDistance / 1000).toFixed(2)}km
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">예상 시간</div>
          <div className="text-lg font-bold text-green-600">
            {Math.floor(simulationData.totalTime / 60)}분 {Math.floor(simulationData.totalTime % 60)}초
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">속도</div>
          <div className="text-lg font-bold text-orange-600">20km/h</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">트래킹 간격</div>
          <div className="text-lg font-bold text-purple-600">5초</div>
        </div>
      </div>

      {/* 진행률 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">진행률</span>
          <span className="font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {currentIndex + 1} / {simulationData.path.length} 포인트
        </div>
      </div>

      {/* 현재 위치 정보 */}
      {currentIndex < simulationData.path.length && (
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-1">현재 위치</div>
          <div className="text-xs text-blue-600">
            위도: {simulationData.path[currentIndex].lat.toFixed(6)}
          </div>
          <div className="text-xs text-blue-600">
            경도: {simulationData.path[currentIndex].lng.toFixed(6)}
          </div>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="flex gap-2">
        {!isSimulating ? (
          <button
            onClick={startSimulation}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 시뮬레이션 시작
          </button>
        ) : (
          <button
            onClick={stopSimulation}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            ⏹️ 시뮬레이션 중지
          </button>
        )}
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          🔄 리셋
        </button>
      </div>

      {/* 경로 정보 */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>📍 시작: 홍대입구역 (2호선)</div>
        <div>🎯 목적지: 신촌역 (2호선)</div>
        <div>🛤️ 경로: 직선 경로</div>
      </div>
    </div>
  );
}; 
