import React, { useEffect, useRef, useState } from 'react';
import { KakaoMap } from '@/components/KakaoMap';
import { GPSSimulator } from '@/components/GPSSimulator';
import { GPSTracker } from '@/components/GPSTracker';
import AnimatedTrailPath from '@/components/AnimatedTrailPath';
import { MOCK_PATH_COORDS } from '@/utils/mockGPSData';
import { 
  interpolatePath, 
  calculateDistance
} from '@/utils/converter/pathConverter';
import type { Coordinate } from '@/types/map';
import type { TrailPathData, TrailProgress, EasingFunction } from '@/types/trail';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { Toaster } from 'sonner';

// 이동 속도 설정 (km/h)
const MOVEMENT_SPEEDS = {
  WALK: 5, // 걷기 속도
  JOG: 8,  // 조깅 속도
  RUN: 12  // 달리기 속도
};

const GPSTestPage: React.FC = () => {
  // 폴리라인 객체 참조
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  const map = useRef<kakao.maps.Map | null>(null);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [smoothness, setSmoothness] = useState(10); // 보간할 점의 개수
  const [movementSpeed, setMovementSpeed] = useState<keyof typeof MOVEMENT_SPEEDS>('WALK');
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const currentIndexRef = useRef(0);
  const interpolatedPathRef = useRef<Coordinate[]>([]);
  const { setPosition } = useGPSStore(state => state.actions);
  const currentGPSPosition = useGPSStore(state => state.position);

  // 산책 경로 진행률 추적 관련 상태
  const [showProgress, setShowProgress] = useState(false);
  const [easingType, setEasingType] = useState<EasingFunction>('linear');
  const [currentProgress, setCurrentProgress] = useState<TrailProgress | null>(null);
  const [testPath, setTestPath] = useState<TrailPathData | null>(null);

  // 실제 거리와 시간을 기반으로 다음 포인트까지의 시간 계산
  const calculateTimeToNextPoint = (currentPoint: Coordinate, nextPoint: Coordinate) => {
    const distance = calculateDistance(currentPoint, nextPoint);
    const speed = MOVEMENT_SPEEDS[movementSpeed]; // km/h
    return (distance / speed) * 3600 * 1000; // milliseconds
  };

  // 경로 표시 (붉은색 - 자유 이동 경로)
  useEffect(() => {
    if (!map.current) return;

    // 기존 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null);
    }

    // 진행률 추적 모드가 아닐 때만 붉은색 폴리라인 표시
    if (!showProgress && pathPositions.length > 0) {
      polyline.current = new kakao.maps.Polyline({
        map: map.current,
        path: pathPositions,
        strokeWeight: 3,
        strokeColor: '#db4040',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      });
    }

    return () => {
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    };
  }, [pathPositions, showProgress]);

  // 진행률 추적 모드 변경 시 폴리라인 관리
  useEffect(() => {
    if (!map.current) return;

    if (showProgress) {
      // 진행률 추적 모드 활성화 시 붉은색 폴리라인 제거
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    } else {
      // 진행률 추적 모드 비활성화 시 붉은색 폴리라인 다시 표시
      if (pathPositions.length > 0 && polyline.current) {
        polyline.current.setMap(map.current);
      }
    }
  }, [showProgress, map.current]);

  // 초기 지도 설정
  useEffect(() => {
    if (!map.current) return;

    const path = MOCK_PATH_COORDS.map(coord => 
      new kakao.maps.LatLng(coord.lat, coord.lng)
    );

    // 지도 중심과 레벨 조정
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(coord => bounds.extend(coord));
    map.current.setBounds(bounds);
  }, [map.current]);

  // 테스트 경로 초기화 (산책 경로 진행률 추적용)
  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
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
        });
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };

    checkKakaoLoaded();
  }, []);

  // 자동 이동 효과
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    let timeToNextPoint = 0;
    let currentProgress = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp;
        if (currentIndexRef.current < interpolatedPathRef.current.length - 1) {
          timeToNextPoint = calculateTimeToNextPoint(
            interpolatedPathRef.current[currentIndexRef.current],
            interpolatedPathRef.current[currentIndexRef.current + 1]
          );
        }
        animationId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTime;
      currentProgress += deltaTime;

      if (currentProgress >= timeToNextPoint) {
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex >= interpolatedPathRef.current.length) {
          setIsAutoMoving(false);
          return;
        }

        const { lat, lng } = interpolatedPathRef.current[nextIndex];
        const position = new kakao.maps.LatLng(lat, lng);
        
        if (map.current) {
          map.current.setCenter(position);
          setPathPositions(prev => [...prev, position]);
          setPosition(position);
        }
        
        currentIndexRef.current = nextIndex;
        currentProgress = 0;
        
        // 다음 포인트까지의 시간 계산
        if (nextIndex < interpolatedPathRef.current.length - 1) {
          timeToNextPoint = calculateTimeToNextPoint(
            interpolatedPathRef.current[nextIndex],
            interpolatedPathRef.current[nextIndex + 1]
          );
        }
      }

      lastTime = timestamp;
      animationId = requestAnimationFrame(animate);
    };

    if (isAutoMoving) {
      lastTime = 0;
      currentProgress = 0;
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAutoMoving, movementSpeed]);

  // 자동 이동 시작/중지
  const toggleAutoMove = () => {
    if (isAutoMoving) {
      setIsAutoMoving(false);
    } else {
      // 현재 위치에서 시작하거나 처음부터 다시 시작
      if (pathPositions.length > 0) {
        currentIndexRef.current = pathPositions.length - 1;
      } else {
        currentIndexRef.current = 0;
        setPathPositions([]); // 경로 초기화
      }

      // 경로 보간 (더 많은 중간점 생성)
      interpolatedPathRef.current = interpolatePath(MOCK_PATH_COORDS, smoothness * 5);
      setIsAutoMoving(true);
    }
  };

  // 부드러움 조절
  const handleSmoothnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSmoothness = parseInt(e.target.value);
    setSmoothness(newSmoothness);
    
    // 경로 다시 보간
    if (!isAutoMoving) {
      interpolatedPathRef.current = interpolatePath(MOCK_PATH_COORDS, newSmoothness * 5);
    }
  };

  // 경로 초기화
  const resetPath = () => {
    setIsAutoMoving(false);
    setPathPositions([]);
    currentIndexRef.current = 0;
    // 경로 다시 보간
    interpolatedPathRef.current = interpolatePath(MOCK_PATH_COORDS, smoothness * 5);
    
    // 진행률 추적 모드가 활성화되어 있으면 기존 폴리라인 제거
    if (showProgress && polyline.current) {
      polyline.current.setMap(null);
    }
  };

  // 위치 변경 핸들러 (수동 이동용)
  const handlePositionChange = (lat: number, lng: number) => {
    if (!map.current) return;
    
    const position = new kakao.maps.LatLng(lat, lng);
    map.current.setCenter(position);
    setPathPositions(prev => [...prev, position]);
    setPosition(position);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3000}
        expand
      />
      {/* 상단 설명 */}
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-2">GPS 테스트</h1>
        <p className="text-gray-600 mb-4">
          시뮬레이터를 사용하여 GPS 위치, 정확도, 에러 상황을 테스트할 수 있습니다.
        </p>
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={resetPath}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            경로 초기화
          </button>
          <button
            onClick={toggleAutoMove}
            className={`px-3 py-1 ${
              isAutoMoving ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } text-white rounded text-sm`}
          >
            {isAutoMoving ? '자동 이동 중지' : '자동 이동 시작'}
          </button>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 min-w-[200px]">
            <label className="text-sm text-gray-600">이동 속도:</label>
            <select
              value={movementSpeed}
              onChange={(e) => setMovementSpeed(e.target.value as keyof typeof MOVEMENT_SPEEDS)}
              className="px-2 py-1 border rounded"
            >
              <option value="WALK">걷기 (5km/h)</option>
              <option value="JOG">조깅 (8km/h)</option>
              <option value="RUN">달리기 (12km/h)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <label className="text-sm text-gray-600">부드러움:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={smoothness}
              onChange={handleSmoothnessChange}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{smoothness}개</span>
          </div>
        </div>

        {/* 산책 경로 진행률 추적 컨트롤 */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🏃‍♂️ 산책 경로 진행률 추적</h3>
          <p className="text-sm text-blue-700 mb-3">
            <strong>🔵 파란색 폴리라인:</strong> 현재 GPS 위치 기준으로 테스트 경로 진행률 추적<br/>
            <strong>🔴 붉은색 폴리라인:</strong> 자유 이동 경로 (진행률 추적 비활성화 시)
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showProgress"
                checked={showProgress}
                onChange={(e) => setShowProgress(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="showProgress" className="text-sm text-gray-700">
                진행률 표시
              </label>
            </div>
            
            {showProgress && (
              <>
                <div className="flex items-center gap-2 min-w-[200px]">
                  <label className="text-sm text-gray-600">이징 함수:</label>
                  <select
                    value={easingType}
                    onChange={(e) => setEasingType(e.target.value as EasingFunction)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="linear">Linear</option>
                    <option value="easeIn">Ease In</option>
                    <option value="easeOut">Ease Out</option>
                    <option value="easeInOut">Ease In Out</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    if (testPath && map.current) {
                      const startPosition = testPath.coordinates[0];
                      map.current.setCenter(startPosition);
                    }
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  시작점으로 이동
                </button>
              </>
            )}
          </div>
          
          {/* 진행률 정보 표시 */}
          {showProgress && currentProgress && (
            <div className="mt-3 p-3 bg-white rounded border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">진행률:</span>
                  <span className="ml-2 text-blue-600">{(currentProgress.progress * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">완료 거리:</span>
                  <span className="ml-2 text-green-600">{currentProgress.completedDistance.toFixed(2)}km</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">전체 거리:</span>
                  <span className="ml-2 text-gray-600">{currentProgress.totalDistance.toFixed(2)}km</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">최근 지점:</span>
                  <span className="ml-2 text-purple-600">{currentProgress.nearestPointIndex + 1}번째</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex">
        {/* 지도 */}
        <div className="flex-1 relative">
          <KakaoMap onMapLoad={(mapInstance) => { map.current = mapInstance; }} />
          {map.current && <GPSTracker map={map.current} />}
          
          {/* 산책 경로 진행률 추적 (파란색) */}
          {map.current && testPath && showProgress && (
            <AnimatedTrailPath
              path={testPath}
              map={map.current}
              isVisible={true}
              currentPosition={currentGPSPosition || undefined}
              showProgress={showProgress}
              easingType={easingType}
              onProgressChange={setCurrentProgress}
            />
          )}
        </div>

        {/* 시뮬레이터 */}
        <div className="w-[300px] p-4 bg-gray-50 border-l border-gray-200">
          <GPSSimulator onPositionChange={handlePositionChange} />
        </div>
      </div>
    </div>
  );
};

export default GPSTestPage; 
