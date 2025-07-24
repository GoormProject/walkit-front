import React, { useEffect, useState, useRef } from 'react';
import { loadKakaoMapSDK, createMap, initGeolocation, DEFAULT_COORDS } from '../utils/kakaoMap';
import LoadingSpinner from './LoadingSpinner';

const KakaoMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<kakao.maps.KakaoMap | null>(null);
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 카카오 맵 SDK 로드
        await loadKakaoMapSDK();

        // 지도 생성 (기본 좌표: 서울 시청)
        const mapInstance = createMap(DEFAULT_COORDS);
        mapRef.current = mapInstance;

        // 위치 권한 요청 및 실시간 위치 감시
        initGeolocation(
          mapInstance,
          userMarkerRef,
          setIsLoading
        );

      } catch (err) {
        console.error('카카오 맵 초기화 실패:', err);
        setError('지도를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 지도 컨테이너 */}
      <div 
        id="map" 
        className="w-full h-[500px] rounded-lg shadow-lg"
        style={{ minHeight: '500px' }}
      />
      
      {/* 로딩 스피너 */}
      <LoadingSpinner show={isLoading} />
      
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">오류: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* 지도 정보 */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          🗺️ 실시간 위치 기반 산책 지도
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          • 기본 위치: 서울 시청 (위치 권한 허용 시 실시간 위치로 이동)
        </p>
        <p className="text-[var(--color-text-secondary)] text-sm">
          • 파란색 마커: 사용자의 현재 위치 (실시간 업데이트)
        </p>
      </div>
    </div>
  );
};

export default KakaoMap; 
