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

        // 카카오 맵 SDK 로드
        await loadKakaoMapSDK();

        // 지도 생성 (기본 좌표: 서울 시청)
        const mapInstance = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng),
          level: 4,
          currentLocationMarker: false, // 기본 현재 위치 마커 비활성화
        });
        mapRef.current = mapInstance;

        // 위치 권한 요청 및 실시간 위치 감시
        initGeolocation(
          mapInstance,
          position => {
            // 지도 중심 이동
            mapInstance.setCenter(position);
          },
          setIsLoading,
          error => {
            console.warn('위치 권한 또는 위치 수신 에러:', error);

            // GPS 에러 상태 업데이트
            setGPSError(error);

            // 에러 메시지 표시
            const errorMessage = handleGPSError(error);
            toast.error(errorMessage, {
              description: '기본 위치(서울 시청)로 표시됩니다.',
            });
          }
        );

        // 지도 인스턴스 콜백
        onMapLoad?.(mapInstance);

        setIsLoading(false);
      } catch (err) {
        console.error('카카오 맵 초기화 실패:', err);
        setError('지도를 불러오는 중 오류가 발생했습니다.');
        toast.error('지도를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initMap();
  }, [onMapLoad, setGPSError]);

  return (
    <div className="relative w-full h-full">
      {/* 지도 컨테이너 */}
      <div ref={containerRef} className="w-full h-full rounded-lg shadow-lg">
        {mapRef.current && <GPSTracker map={mapRef.current} />}
      </div>

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
      <LoadingSpinner show={isLoading} />

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">오류: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
