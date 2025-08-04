import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import KakaoMap from '@/components/KakaoMap';
import { GPSTracker } from '@/components/GPSTracker';
import { GPSSimulator } from '@/components/GPSSimulator';
import { useWalkStore } from '@/features/walk/walkSlice';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { AuthenticationPanel } from '@/components/test/AuthenticationPanel';
import { WalkControlPanel } from '@/components/test/WalkControlPanel';
import { WalkRecordsList } from '@/components/test/WalkRecordsList';

const WalkFullTest: React.FC = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const [showSimulator, setShowSimulator] = useState(false);
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  
  // Walk Store
  const {
    currentWalk,
    isLoading,
    actions: walkActions,
  } = useWalkStore();
  
  // GPS Store
  const { position, error: gpsError } = useGPSStore();

  // 위치 업데이트 시 경로 그리기 및 저장
  const handlePositionUpdate = useCallback((position: kakao.maps.LatLng) => {
    if (currentWalk.status === 'walking') {
      console.log('📍 위치 업데이트:', {
        lat: position.getLat(),
        lng: position.getLng(),
        walkStatus: currentWalk.status
      });
      
      setPathPositions(prev => {
        const newPath = [...prev, position];
        console.log('🛤️ 경로 포인트 추가:', newPath.length);
        return newPath;
      });
      
      // Walk Store에 좌표 추가
      walkActions.addPathCoordinate([position.getLng(), position.getLat()]);
    }
  }, [currentWalk.status, walkActions]);

  // 산책 상태 변경 시 경로 초기화
  useEffect(() => {
    if (currentWalk.status === 'idle') {
      setPathPositions([]);
    } else if (currentWalk.status === 'walking' && currentWalk.path.length === 0) {
      // 새로운 산책 시작 시 경로 초기화
      setPathPositions([]);
    }
  }, [currentWalk.status, currentWalk.path.length]);

  // 경로 표시 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null);
    }

    // 새 폴리라인 생성
    polyline.current = new kakao.maps.Polyline({
      map: map,
      path: pathPositions,
      strokeWeight: 4,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    return () => {
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    };
  }, [pathPositions, map]);

  // 컴포넌트 마운트 시 산책 기록 목록 조회
  useEffect(() => {
    walkActions.getWalkRecords();
  }, [walkActions]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" richColors />

      {/* 헤더 */}
      <div className="bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">산책 통합 테스트</h1>
        <p className="text-gray-600">GPS + 지도 + API 통합 테스트</p>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <KakaoMap
          onMapLoad={mapInstance => {
            setMap(mapInstance);
          }}
        />
        {map && (
          <GPSTracker
            map={map}
            onPositionUpdate={handlePositionUpdate}
            disabled={showSimulator}
          />
        )}

        {/* 상단 컨트롤 */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSimulator(!showSimulator)}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all"
              title="가상 GPS 시뮬레이터"
            >
              🎯
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* GPS 상태 표시 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg text-xs">
              {gpsError ? (
                <span className="text-red-500">❌ GPS 오류</span>
              ) : position ? (
                <span className="text-green-500">✅ GPS 연결됨</span>
              ) : (
                <span className="text-gray-500">⏳ GPS 대기중</span>
              )}
            </div>

            {/* 산책 상태 표시 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg text-xs">
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
          </div>
        </div>

        {/* 가상 GPS 시뮬레이터 */}
        {showSimulator && (
          <div className="absolute top-16 left-4 right-4 z-20">
            <GPSSimulator onPositionUpdate={handlePositionUpdate} />
          </div>
        )}
      </div>

      {/* 하단 패널들 */}
      <div className="flex flex-col gap-4 p-4 bg-gray-100">
        {/* 인증 패널 */}
        <AuthenticationPanel isLoading={isLoading} />
        
        {/* 산책 컨트롤 패널 */}
        <WalkControlPanel pathPositions={pathPositions} />
        
        {/* 산책 기록 목록 */}
        <WalkRecordsList />
      </div>
    </div>
  );
};

export default WalkFullTest; 
