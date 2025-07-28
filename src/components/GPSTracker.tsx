import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { getGPSErrorInfo, getAccuracyWarning } from '@/utils/gpsErrorHandler';

interface GPSTrackerProps {
  map: kakao.maps.Map;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ map }) => {
  const userMarker = useRef<kakao.maps.Marker | null>(null);
  const watchId = useRef<number | null>(null);
  
  const { setError, setAccuracy, setLoading } = useGPSStore(state => state.actions);
  const error = useGPSStore(state => state.error);
  
  // 에러 상태 변경 시에만 토스트 표시
  useEffect(() => {
    if (error) {
      const errorInfo = getGPSErrorInfo(error);
      toast.error(errorInfo.message, {
        description: errorInfo.guideText,
        action: errorInfo.guideLink ? {
          label: '자세히 보기',
          onClick: () => window.location.href = errorInfo.guideLink!
        } : undefined
      });
    }
  }, [error]);

  useEffect(() => {
    // 마커 초기 생성 (지도 중심에)
    if (!userMarker.current) {
      const center = map.getCenter();
      userMarker.current = new kakao.maps.Marker({ 
        map,
        position: center
      });
    }

    if (!navigator.geolocation) {
      setError({
        code: 2, // POSITION_UNAVAILABLE
        message: 'Geolocation API를 지원하지 않습니다.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    // watchPosition 시작
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLoading(false);
        const { latitude, longitude, accuracy } = position.coords;
        const userLatLng = new kakao.maps.LatLng(latitude, longitude);
        
        // 마커 위치만 업데이트
        if (userMarker.current) {
          userMarker.current.setPosition(userLatLng);
        }
        
        // 지도 중심 이동
        map.setCenter(userLatLng);
        
        // 정확도 상태 업데이트 및 경고
        setAccuracy(accuracy);
        const warning = getAccuracyWarning(accuracy);
        if (warning) {
          toast.warning(warning);
        }
      },
      (error) => {
        setLoading(false);
        setError(error);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 10000, 
        timeout: 10000 
      }
    );

    // 클린업 함수
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (userMarker.current) {
        userMarker.current.setMap(null);
        userMarker.current = null;
      }
      setError(null);
      setAccuracy(null);
      setLoading(false);
    };
  }, [map, setError, setAccuracy, setLoading]);

  return null;
}; 
