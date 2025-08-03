import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  loadKakaoMapSDK,
  createMap,
  initGeolocation,
  DEFAULT_COORDS,
} from '@/utils/kakaoMapApi';
import LoadingSpinner from './LoadingSpinner';
import TrailVisualization from './TrailVisualization';
import { GPSTracker } from './GPSTracker';
import { MapFallback } from './MapFallback';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { handleGPSError } from '@/utils/gpsErrorHandler';

interface KakaoMapProps {
  showTrailPaths?: boolean;
  selectedTrailId?: string;
  onTrailClick?: (trailId: string) => void;
  onTrailHover?: (trailId: string | null) => void;
  onMapLoad?: (map: kakao.maps.Map) => void;
}

export const KakaoMap: React.FC<KakaoMapProps> = ({
  showTrailPaths = false,
  selectedTrailId,
  onTrailClick,
  onTrailHover,
  onMapLoad,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setError: setGPSError } = useGPSStore(state => state.actions);
  const { isLoading: gpsLoading } = useGPSStore(state => state);

  useEffect(() => {
    const initMap = async () => {
      // 컨테이너가 없으면 초기화하지 않음
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // 이미 초기화된 경우 중복 초기화 방지
        if (mapRef.current) return;

        // 환경 변수 검증
        if (!import.meta.env.VITE_KAKAO_MAP_API_KEY) {
          throw new Error(
            '카카오 맵 API 키가 설정되지 않았습니다. README.md를 참조하여 환경 변수를 설정해주세요.'
          );
        }

        // DOM이 완전히 렌더링될 때까지 대기 (성능 개선을 위해 시간 단축)
        await new Promise(resolve => setTimeout(resolve, 50));

        // 컨테이너가 여전히 존재하는지 확인
        if (!containerRef.current) return;

        console.log('🗺️ 카카오맵 SDK 로드 시작');
        
        // 카카오 맵 SDK 로드
        await loadKakaoMapSDK();

        // 컨테이너가 여전히 존재하는지 다시 확인
        if (!containerRef.current) return;

        console.log('🗺️ 카카오맵 인스턴스 생성 시작');

        // 지도 생성 (기본 좌표: 서울 시청)
        const mapInstance = new window.kakao.maps.Map(containerRef.current, {
          center: new window.kakao.maps.LatLng(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng),
          level: 4,
          currentLocationMarker: false, // 기본 현재 위치 마커 비활성화
        });
        mapRef.current = mapInstance;

        // 지도 인스턴스 콜백
        onMapLoad?.(mapInstance);

        // 로딩 상태를 확실히 false로 설정
        setIsLoading(false);
        console.log('🗺️ 카카오맵 초기화 완료');
      } catch (err) {
        console.error('카카오 맵 초기화 실패:', err);
        const errorMessage = err instanceof Error ? err.message : '지도를 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    // 컴포넌트가 마운트된 후 지연을 두고 초기화 (성능 개선)
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [onMapLoad, setGPSError]);

  // 지도가 로드된 후 로딩 상태 확인
  useEffect(() => {
    if (mapRef.current && isLoading) {
      console.log('🗺️ 지도 로드 완료 - 로딩 상태 강제 해제');
      setIsLoading(false);
    }
  }, [mapRef.current, isLoading]);

  return (
    <div className="relative w-full h-full">
      {/* 에러 상태 */}
      {error && !isLoading && (
        <MapFallback 
          error={error} 
          onRetry={() => {
            setError(null);
            setIsLoading(false);
            mapRef.current = null;
            // 컴포넌트를 다시 마운트하기 위해 key를 변경
            window.location.reload();
          }} 
        />
      )}

      {/* 지도 컨테이너 */}
      {!error && (
        <div 
          ref={containerRef} 
          className="w-full h-full rounded-lg shadow-lg bg-gray-100"
          style={{ minHeight: '300px' }}
        >
          {mapRef.current && <GPSTracker map={mapRef.current} />}
        </div>
      )}

      {/* 산책 경로 시각화 */}
      {showTrailPaths && mapRef.current && (
        <TrailVisualization
          map={mapRef.current}
          showTrailPaths={showTrailPaths}
          selectedTrailId={selectedTrailId}
          onTrailClick={onTrailClick}
          onTrailHover={onTrailHover}
        />
      )}

      {/* 로딩 스피너 */}
      <LoadingSpinner show={isLoading} variant="inline" />
    </div>
  );
};

export default KakaoMap;
