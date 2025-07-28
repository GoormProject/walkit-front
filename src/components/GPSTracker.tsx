import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { getGPSErrorInfo, getAccuracyWarning } from '@/utils/gpsErrorHandler';
import { CustomMarker } from './CustomMarker';

interface GPSTrackerProps {
  map: kakao.maps.Map;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ map }) => {
  const [currentPosition, setCurrentPosition] = useState<kakao.maps.LatLng | null>(null);
  const [heading, setHeading] = useState(0);
  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<kakao.maps.LatLng | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  
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
    setCurrentPosition(center);
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

    // 기존 마커 생성
    if (!markerRef.current) {
      markerRef.current = new kakao.maps.Marker({
        position: center,
        map: map
      });
    }

    // watchPosition 시작
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLoading(false);
        const { latitude, longitude, accuracy } = position.coords;
        const userLatLng = new kakao.maps.LatLng(latitude, longitude);
        
        // 이동 방향 계산
        if (lastPosition.current) {
          const newHeading = calculateHeading(lastPosition.current, userLatLng);
          setHeading(newHeading);
        }
        lastPosition.current = userLatLng;
        
        // 위치 업데이트
        setCurrentPosition(userLatLng);
        
        // 마커 위치 업데이트
        if (markerRef.current) {
          markerRef.current.setPosition(userLatLng);
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
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setError(null);
      setAccuracy(null);
      setLoading(false);
    };
  }, [map, setError, setAccuracy, setLoading]);

  // 현재 위치가 있을 때만 마커 렌더링
  if (!currentPosition) return null;

  return (
    <CustomMarker
      map={map}
      position={currentPosition}
      heading={heading}
    />
  );
}; 
