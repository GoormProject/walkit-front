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
  const [isMapReady, setIsMapReady] = useState(false);
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
        });
        
        // 지도 상호작용 명시적 활성화 (공식 문서 방식)
        (mapInstance as any).setDraggable(true);
        (mapInstance as any).setZoomable(true);
        mapRef.current = mapInstance;

        // 지도 상호작용 상태 확인
        console.log('🗺️ 지도 상호작용 설정 완료:', {
          draggable: (mapInstance as any).getDraggable(),
          zoomable: (mapInstance as any).getZoomable(),
          mapInstance: !!mapInstance,
        });

        // 지도 이벤트 리스너 테스트 (지도 상호작용 확인용)
        window.kakao.maps.event.addListener(mapInstance, 'click', function(mouseEvent: any) {
          const latlng = mouseEvent.latLng;
          console.log('🗺️ 지도 클릭됨:', {
            lat: latlng.getLat(),
            lng: latlng.getLng(),
            timestamp: new Date().toISOString()
          });
        });

        window.kakao.maps.event.addListener(mapInstance, 'dragstart', function() {
          console.log('🗺️ 지도 드래그 시작');
        });

        window.kakao.maps.event.addListener(mapInstance, 'dragend', function() {
          console.log('🗺️ 지도 드래그 종료');
        });

        window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', function() {
          console.log('🗺️ 지도 줌 변경됨:', (mapInstance as any).getLevel());
        });

        // 지도 인스턴스 콜백
        onMapLoad?.(mapInstance);

        // 지도 준비 상태 설정
        setIsMapReady(true);
        
        // 로딩 상태를 확실히 false로 설정
        setIsLoading(false);
        console.log('🗺️ 카카오맵 초기화 완료 - 마커 생성 가능');
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
      setIsMapReady(true);
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
          style={{ 
            minHeight: '100%',
            position: 'relative',
            zIndex: 1
          }}
          onClick={(e) => {
            console.log('🗺️ 지도 컨테이너 클릭됨:', {
              target: e.target,
              currentTarget: e.currentTarget,
              clientX: e.clientX,
              clientY: e.clientY,
              timestamp: new Date().toISOString()
            });
          }}
          onMouseDown={(e) => {
            console.log('🗺️ 지도 컨테이너 마우스 다운:', {
              button: e.button,
              clientX: e.clientX,
              clientY: e.clientY
            });
          }}
          onWheel={(e) => {
            console.log('🗺️ 지도 컨테이너 휠 이벤트:', {
              deltaY: e.deltaY,
              clientX: e.clientX,
              clientY: e.clientY
            });
          }}
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
