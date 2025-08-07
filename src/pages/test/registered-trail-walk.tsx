import React, { useState, useEffect, useRef } from 'react';
import KakaoMap from '@/components/KakaoMap';
import RegisteredTrailList from '@/components/RegisteredTrailList';
import RegisteredTrailWalker from '@/components/RegisteredTrailWalker';
import type { RegisteredTrail } from '@/utils/mockTrailApi';
import { getRegisteredTrailById } from '@/utils/mockTrailApi';
import { progressToPercentage } from '@/utils/trailProgressUtils';
import { handleGPSError } from '@/utils/gpsErrorHandler';

const RegisteredTrailWalkTest: React.FC = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<RegisteredTrail | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);

  // GPS 위치 추적 시작
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 GPS를 지원하지 않습니다.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
      },
      (error) => {
        console.error('GPS 위치 추적 오류:', error);
        const errorMessage = handleGPSError(error);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    setWatchId(id);
  };

  // GPS 위치 추적 중지
  const stopLocationTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // 산책 시작
  const startWalking = () => {
    if (!selectedTrail) {
      alert('먼저 산책로를 선택해주세요.');
      return;
    }
    
    setIsWalking(true);
    startLocationTracking();
  };

  // 산책 중지
  const stopWalking = () => {
    setIsWalking(false);
    stopLocationTracking();
    setProgress(0);
  };

  // 산책로 선택
  const handleTrailSelect = (trail: RegisteredTrail) => {
    setSelectedTrail(trail);
    setProgress(0);
    
    // 선택된 산책로로 지도 중심 이동
    if (map) {
      const center = new kakao.maps.LatLng(
        trail.geoPoint.latitude,
        trail.geoPoint.longitude
      );
      map.setCenter(center);
      map.setLevel(5); // 적절한 줌 레벨
    }
  };

  // 진행률 업데이트
  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  // 컴포넌트 언마운트 시 GPS 추적 정리
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">등록된 산책로 따라 걷기</h1>
        <p className="text-sm text-gray-600 mt-1">
          등록된 산책로를 선택하고 실제로 걸어보세요!
        </p>
      </div>

      <div className="flex-1 flex">
        {/* 사이드바 */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* 산책로 목록 */}
            <RegisteredTrailList
              onTrailSelect={handleTrailSelect}
              selectedTrailId={selectedTrail?.walkId}
            />

            {/* 컨트롤 패널 */}
            {selectedTrail && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">산책 컨트롤</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">선택된 산책로</p>
                    <p className="text-sm text-gray-600">{selectedTrail.title}</p>
                  </div>

                  {isWalking && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">진행률</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${progressToPercentage(progress)}%`,
                            backgroundColor: progress >= 0.8 ? '#4CAF50' : progress >= 0.5 ? '#FF9800' : '#2196F3'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progressToPercentage(progress)}% 완료</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {!isWalking ? (
                      <button
                        onClick={startWalking}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        산책 시작
                      </button>
                    ) : (
                      <button
                        onClick={stopWalking}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        산책 중지
                      </button>
                    )}
                  </div>

                  {currentPosition && (
                    <div className="text-xs text-gray-500">
                      <p>현재 위치:</p>
                      <p>위도: {currentPosition.latitude.toFixed(6)}</p>
                      <p>경도: {currentPosition.longitude.toFixed(6)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 사용법 안내 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">사용법</h4>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. 왼쪽에서 산책로를 선택하세요</li>
                <li>2. "산책 시작" 버튼을 클릭하세요</li>
                <li>3. 실제로 산책로를 따라 걸어보세요</li>
                <li>4. 진행률이 실시간으로 업데이트됩니다</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <KakaoMap onMapLoad={setMap} />
          
          {/* 등록된 산책로 워커 */}
          {map && selectedTrail && (
            <RegisteredTrailWalker
              map={map}
              trail={selectedTrail}
              currentPosition={currentPosition}
              isWalking={isWalking}
              onProgressUpdate={handleProgressUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredTrailWalkTest; 
