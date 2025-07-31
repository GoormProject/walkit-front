import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import KakaoMap from '../components/KakaoMap';
import { GPSTracker } from '@/components/GPSTracker';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { calculateDistance as calculateCoordinateDistance } from '@/utils/converter/pathConverter';
import { isOAuthCallback } from '@/utils/oauth';

const Home = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const map = useRef<kakao.maps.Map | null>(null);
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  const { error } = useGPSStore();

  // OAuth 콜백 확인 (디버깅용)
  useEffect(() => {
    console.log('🏠 홈 페이지 로드됨');
    console.log('📍 현재 URL:', window.location.href);
    console.log('🔍 URL 파라미터:', window.location.search);
    console.log('🔄 OAuth 콜백 여부:', isOAuthCallback());

    if (isOAuthCallback()) {
      console.log('⚠️ 홈 페이지에서 OAuth 콜백 감지됨!');
      console.log('🚨 OAuth 콜백이 홈 페이지로 리다이렉트되었습니다.');
    }
  }, []);

  // 산책 시작
  const handleStartWalk = () => {
    setIsWalking(true);
    setPathPositions([]);
    toast.success('산책을 시작합니다!', {
      description: 'GPS 신호가 안정적인 실외에서 이용해주세요.',
    });
  };

  // 산책 종료
  const handleEndWalk = () => {
    setIsWalking(false);
    // TODO: 산책 기록 저장 로직 추가
    toast.success('산책이 종료되었습니다!', {
      description: `총 거리: ${calculateTotalDistance(pathPositions).toFixed(2)}km`,
    });
  };

  // 경로의 총 거리 계산
  const calculateTotalDistance = (positions: kakao.maps.LatLng[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      totalDistance += calculateDistance(prev, curr);
    }
    return totalDistance;
  };

  // 두 지점 간의 거리 계산 (km)
  const calculateDistance = (
    pos1: kakao.maps.LatLng,
    pos2: kakao.maps.LatLng
  ): number => {
    return calculateCoordinateDistance(
      { lat: pos1.getLat(), lng: pos1.getLng() },
      { lat: pos2.getLat(), lng: pos2.getLng() }
    );
  };

  // 위치 업데이트 시 경로 그리기
  const handlePositionUpdate = (position: kakao.maps.LatLng) => {
    if (isWalking) {
      setPathPositions(prev => [...prev, position]);
    }
  };

  // 경로 표시 업데이트
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
  }, [pathPositions]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" richColors />

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <KakaoMap
          onMapLoad={mapInstance => {
            map.current = mapInstance;
          }}
        />
        {map.current && (
          <GPSTracker
            map={map.current}
            onPositionUpdate={handlePositionUpdate}
          />
        )}

        {/* 상단 버튼 */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all">
              <span className="material-icons text-gray-700">menu</span>
            </button>
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all">
              <span className="material-icons text-gray-700">search</span>
            </button>
          </div>
          <div>
            {!isWalking ? (
              <button
                onClick={handleStartWalk}
                disabled={!!error}
                className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                산책 시작
              </button>
            ) : (
              <button
                onClick={handleEndWalk}
                className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
              >
                산책 종료
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-around items-center">
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <span className="material-icons mb-1">person</span>
            <span>프로필</span>
          </Link>
          <Link
            to="/friends"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <span className="material-icons mb-1">group</span>
            <span>친구</span>
          </Link>
          <Link
            to="/reviews"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <span className="material-icons mb-1">star</span>
            <span>리뷰</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Home;
