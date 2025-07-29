import React, { useState, useRef, useEffect } from 'react';
import KakaoMap from '../../components/KakaoMap';
import AnimatedTrailPath from '../../components/AnimatedTrailPath';
import type { TrailPathData, TrailProgress, EasingFunction } from '../../types/trail';
import { MOCK_PATH_COORDS } from '../../utils/mockGPSData';

const TrailProgressTest: React.FC = () => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState<kakao.maps.LatLng | null>(null);
  const [showProgress, setShowProgress] = useState(true);
  const [easingType, setEasingType] = useState<EasingFunction>('easeOut');
  const [currentProgress, setCurrentProgress] = useState<TrailProgress | null>(null);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [movementSpeed, setMovementSpeed] = useState(5); // km/h
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const currentIndexRef = useRef(0);

  // 테스트용 경로 데이터 생성
  const [testPath, setTestPath] = useState<TrailPathData | null>(null);

  useEffect(() => {
    // kakao 객체가 로드된 후에 경로 데이터 생성
    if (window.kakao && window.kakao.maps) {
      const path: TrailPathData = {
        id: 'test-trail',
        name: '테스트 산책로',
        courseType: 'walking',
        coordinates: MOCK_PATH_COORDS.map(coord => new window.kakao.maps.LatLng(coord.lat, coord.lng)),
        style: {
          strokeColor: '#3b82f6',
          strokeWeight: 4,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        },
        properties: {}
      };
      setTestPath(path);
      setIsLoading(false);
    }
  }, []);

  // 자동 이동 효과
  useEffect(() => {
    if (!isAutoMoving || !mapRef.current || !testPath) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      const distancePerMs = (movementSpeed / 3600000); // km/h를 km/ms로 변환
      const distanceMoved = deltaTime * distancePerMs;

      // 다음 위치로 이동
      if (currentIndexRef.current < testPath.coordinates.length - 1) {
        const nextIndex = Math.min(
          currentIndexRef.current + Math.floor(distanceMoved * 1000), // 거리를 인덱스로 변환
          testPath.coordinates.length - 1
        );
        
        if (nextIndex !== currentIndexRef.current) {
          currentIndexRef.current = nextIndex;
          const newPosition = testPath.coordinates[nextIndex];
          setCurrentPosition(newPosition);
          
          // 지도 중심 이동
          mapRef.current?.setCenter(newPosition);
        }
      } else {
        setIsAutoMoving(false);
        return;
      }

      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoMoving, movementSpeed, testPath]);

  // 수동 위치 변경
  const handlePositionChange = (lat: number, lng: number) => {
    const position = new kakao.maps.LatLng(lat, lng);
    setCurrentPosition(position);
    mapRef.current?.setCenter(position);
  };

  // 자동 이동 토글
  const toggleAutoMove = () => {
    if (isAutoMoving) {
      setIsAutoMoving(false);
    } else {
      if (testPath) {
        currentIndexRef.current = 0;
        setCurrentPosition(testPath.coordinates[0]);
        setIsAutoMoving(true);
      }
    }
  };

  // 진행률 정보 표시
  const renderProgressInfo = () => {
    if (!currentProgress) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">진행률 정보</h3>
        <div className="space-y-2 text-sm">
          <p><strong>진행률:</strong> {(currentProgress.progress * 100).toFixed(1)}%</p>
          <p><strong>완료 거리:</strong> {currentProgress.completedDistance.toFixed(2)}km</p>
          <p><strong>전체 거리:</strong> {currentProgress.totalDistance.toFixed(2)}km</p>
          <p><strong>현재 위치:</strong> {currentProgress.currentPosition.getLat().toFixed(6)}, {currentProgress.currentPosition.getLng().toFixed(6)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚶‍♂️ 산책 경로 진행률 추적 테스트
          </h1>
          <p className="text-gray-600 mb-4">
            GPS 위치에 따른 산책 경로 진행률을 실시간으로 추적하고 표시합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="lg:col-span-1 space-y-4">
            {isLoading && (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">카카오맵 로딩 중...</span>
                </div>
              </div>
            )}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">컨트롤</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    진행률 표시
                  </label>
                  <button
                    onClick={() => setShowProgress(!showProgress)}
                    className={`w-full px-3 py-2 rounded ${
                      showProgress 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {showProgress ? '진행률 표시 중' : '진행률 숨김'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이징 함수
                  </label>
                  <select
                    value={easingType}
                    onChange={(e) => setEasingType(e.target.value as EasingFunction)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="linear">Linear (일정한 속도)</option>
                    <option value="easeIn">Ease In (천천히 시작)</option>
                    <option value="easeOut">Ease Out (천천히 끝남)</option>
                    <option value="easeInOut">Ease In Out (부드러운 시작과 끝)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이동 속도: {movementSpeed}km/h
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={movementSpeed}
                    onChange={(e) => setMovementSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <button
                    onClick={toggleAutoMove}
                    className={`w-full px-3 py-2 rounded ${
                      isAutoMoving 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isAutoMoving ? '자동 이동 중지' : '자동 이동 시작'}
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (testPath) {
                        setCurrentPosition(testPath.coordinates[0]);
                        currentIndexRef.current = 0;
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    시작점으로 이동
                  </button>
                </div>
              </div>
            </div>

            {/* 진행률 정보 */}
            {renderProgressInfo()}

            {/* 수동 위치 입력 */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">수동 위치 입력</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handlePositionChange(37.5665, 126.9780)}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  서울 시청
                </button>
                <button
                  onClick={() => handlePositionChange(37.5685, 126.9800)}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  중간 지점
                </button>
                <button
                  onClick={() => handlePositionChange(37.5698, 126.9806)}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  끝 지점
                </button>
              </div>
            </div>
          </div>

          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <KakaoMap onMapLoad={(map) => { mapRef.current = map; }} />
              {mapRef.current && testPath && (
                <AnimatedTrailPath
                  path={testPath}
                  map={mapRef.current}
                  isVisible={true}
                  currentPosition={currentPosition || undefined}
                  showProgress={showProgress}
                  easingType={easingType}
                  onProgressChange={setCurrentProgress}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 테스트 가이드
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>진행률 표시:</strong> GPS 위치에 따라 경로가 완료 구간(실선)과 남은 구간(점선)으로 분할됩니다.</p>
            <p>• <strong>자동 이동:</strong> 경로를 따라 자동으로 이동하며 진행률을 실시간으로 확인할 수 있습니다.</p>
            <p>• <strong>이징 함수:</strong> 애니메이션의 가속/감속 패턴을 선택할 수 있습니다.</p>
            <p>• <strong>수동 위치:</strong> 버튼을 클릭하여 특정 지점으로 이동할 수 있습니다.</p>
            <p>• <strong>진행률 정보:</strong> 현재 진행률, 완료 거리, 전체 거리 등을 실시간으로 확인할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailProgressTest; 
