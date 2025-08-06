import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Timer, TrendingUp } from 'lucide-react';

interface WalkSummaryProps {
  distance: number; // km
  duration: number; // seconds
  path: number[][]; // [[lng, lat], ...]
  onComplete: () => void;
}

const WalkSummary: React.FC<WalkSummaryProps> = ({
  distance,
  duration,
  path,
  onComplete,
}) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 평균 페이스 계산 (분/km)
  const calculateAveragePace = (): string => {
    if (distance === 0) return '0:00';
    
    const totalMinutes = duration / 60;
    const paceMinutes = totalMinutes / distance;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.floor((paceMinutes - paceMin) * 60);
    
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
  };

  // 현재 날짜 포맷팅
  const formatDate = (): string => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes} (종료시간)`;
  };

  // 지도 렌더링
  useEffect(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.warn('Kakao Maps API가 로드되지 않았습니다.');
      return;
    }

    try {
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 경로가 있으면 폴리라인 그리기
      if (path && path.length > 0) {
        // 좌표 유효성 검사
        const validPath = path.filter(coord => 
          Array.isArray(coord) && coord.length === 2 && 
          typeof coord[0] === 'number' && typeof coord[1] === 'number'
        );
        
        if (validPath.length === 0) {
          console.warn('유효한 경로 데이터가 없습니다.');
          return;
        }

        const pathPositions = validPath.map(([lng, lat]) => 
          new window.kakao.maps.LatLng(lat, lng)
        );

        const polyline = new window.kakao.maps.Polyline({
          path: pathPositions,
          strokeWeight: 5,
          strokeColor: '#FF0000',
          strokeOpacity: 0.7,
          strokeStyle: 'solid',
          map: map
        });

        // 경로를 포함하는 영역으로 지도 이동
        const bounds = new window.kakao.maps.LatLngBounds();
        pathPositions.forEach(pos => bounds.extend(pos));
        map.setBounds(bounds);
      }
    } catch (error) {
      console.error('지도 렌더링 중 오류 발생:', error);
    }
  }, [path]);

  return (
    <div className="app">
      <div className="flex flex-col h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <div className="text-sm text-gray-500">{formatDate()}</div>
              <div className="text-lg font-semibold text-gray-900">제목</div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="material-icons text-gray-600">edit</span>
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-4 bg-gray-50">
          {/* 거리 표시 */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {distance.toFixed(2)}
            </div>
            <div className="text-lg text-gray-600">킬로미터</div>
          </div>

          {/* 통계 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {calculateAveragePace()}
              </div>
              <div className="text-sm text-gray-600">평균 페이스</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(duration)}
              </div>
              <div className="text-sm text-gray-600">시간</div>
            </div>
          </div>

          {/* 지도 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
            <div 
              ref={mapRef}
              className="w-full h-64"
            />
          </div>

          {/* 완료 버튼 */}
          <button
            onClick={onComplete}
            className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkSummary; 
