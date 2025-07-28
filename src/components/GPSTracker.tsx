import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { getGPSErrorInfo, getAccuracyWarning } from '@/utils/gpsErrorHandler';
import { CustomMarker } from './CustomMarker';

interface GPSTrackerProps {
  map: kakao.maps.Map;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ map }) => {
  const userMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<kakao.maps.LatLng | null>(null);
  
  const { setError, setAccuracy, setLoading } = useGPSStore(state => state.actions);
  const error = useGPSStore(state => state.error);
  
  // 이동 방향 계산 (도 단위, 0-360)
  const calculateHeading = (prev: kakao.maps.LatLng, current: kakao.maps.LatLng): number => {
    const dy = current.getLat() - prev.getLat();
    const dx = current.getLng() - prev.getLng();
    const rad = Math.atan2(dy, dx);
    const deg = rad * (180 / Math.PI);
    return (deg + 360) % 360;
  };

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
    const center = map.getCenter();
    lastPosition.current = center;

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
        
        // 이동 방향 계산
        let heading = 0;
        if (lastPosition.current) {
          heading = calculateHeading(lastPosition.current, userLatLng);
        }
        lastPosition.current = userLatLng;
        
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
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      setError(null);
      setAccuracy(null);
      setLoading(false);
    };
  }, [map, setError, setAccuracy, setLoading]);

  return null;
}; 
