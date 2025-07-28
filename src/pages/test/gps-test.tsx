import React, { useEffect, useRef, useState } from 'react';
import { KakaoMap } from '@/components/KakaoMap';
import { GPSSimulator } from '@/components/GPSSimulator';
import { GPSTracker } from '@/components/GPSTracker';
import { MOCK_PATH_COORDS } from '@/utils/mockGPSData';
import { 
  interpolatePath, 
  calculateDistance
} from '@/utils/converter/pathConverter';
import type { Coordinate } from '@/types/map';
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

  // 실제 거리와 시간을 기반으로 다음 포인트까지의 시간 계산
  const calculateTimeToNextPoint = (currentPoint: Coordinate, nextPoint: Coordinate) => {
    const distance = calculateDistance(currentPoint, nextPoint);
    const speed = MOVEMENT_SPEEDS[movementSpeed]; // km/h
    return (distance / speed) * 3600 * 1000; // milliseconds
  };

  // 경로 표시
  useEffect(() => {
    if (!map.current) return;

    // 기존 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null);
    }

    // 새 폴리라인 생성
    polyline.current = new kakao.maps.Polyline({
      map: map.current,
      path: pathPositions,
      strokeWeight: 3,
      strokeColor: '#db4040',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });

    return () => {
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    };
  }, [pathPositions]);

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
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex">
        {/* 지도 */}
        <div className="flex-1 relative">
          <KakaoMap onMapLoad={(mapInstance) => { map.current = mapInstance; }} />
          {map.current && <GPSTracker map={map.current} />}
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
