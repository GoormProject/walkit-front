import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { getGPSErrorInfo, getAccuracyWarning } from '@/utils/gpsErrorHandler';
import { CustomMarker } from './CustomMarker';
import { initGeolocation } from '@/utils/kakaoMapApi';

interface GPSTrackerProps {
  map: kakao.maps.Map;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ map }) => {
  const [currentPosition, setCurrentPosition] = useState<kakao.maps.LatLng | null>(null);
  const [heading, setHeading] = useState(0);
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
    setCurrentPosition(center);
    lastPosition.current = center;

    // 위치 추적 초기화
    initGeolocation(
      map,
      (position) => {
        // 이동 방향 계산
        if (lastPosition.current) {
          const newHeading = calculateHeading(lastPosition.current, position);
          setHeading(newHeading);
        }
        lastPosition.current = position;
        
        // 위치 업데이트
        setCurrentPosition(position);
      },
      setLoading,
      setError
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
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
