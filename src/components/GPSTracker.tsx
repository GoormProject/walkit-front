import { useEffect, useRef, useState } from 'react';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { CustomMarker } from './CustomMarker';
import { initGeolocation } from '@/utils/kakaoMapApi';
import { toast } from 'sonner';
import { handleGPSError } from '@/utils/gpsErrorHandler';

interface GPSTrackerProps {
  map: kakao.maps.Map;
  onPositionUpdate?: (position: kakao.maps.LatLng) => void;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ map, onPositionUpdate }) => {
  const [heading, setHeading] = useState(0);
  const lastPosition = useRef<kakao.maps.LatLng | null>(null);
  const markerKey = useRef(0);
  
  const { setError, setAccuracy, setLoading, setPosition } = useGPSStore(state => state.actions);
  const error = useGPSStore(state => state.error);
  const currentPosition = useGPSStore(state => state.position);
  
  // 이동 방향 계산 (도 단위, 0-360)
  const calculateHeading = (prev: kakao.maps.LatLng, current: kakao.maps.LatLng): number => {
    const dy = current.getLat() - prev.getLat();
    const dx = current.getLng() - prev.getLng();
    const rad = Math.atan2(dy, dx);
    const deg = rad * (180 / Math.PI);
    return (deg + 360) % 360;
  };

  // 위치가 변경될 때마다 마커 키를 업데이트
  useEffect(() => {
    if (currentPosition) {
      markerKey.current += 1;
      onPositionUpdate?.(currentPosition);
    }
  }, [currentPosition, onPositionUpdate]);

  useEffect(() => {
    // 위치 추적 초기화
    const cleanup = initGeolocation(
      map,
      (position) => {
        // 이동 방향 계산
        if (lastPosition.current) {
          const newHeading = calculateHeading(lastPosition.current, position);
          setHeading(newHeading);
        }
        lastPosition.current = position;
        
        // 위치 업데이트
        setPosition(position);
      },
      setLoading,
      (error) => {
        setError(error);
        const errorMessage = handleGPSError(error);
        toast.error(errorMessage, {
          description: '기본 위치(서울 시청)로 표시됩니다.',
        });
      }
    );

    return () => {
      cleanup?.();
      setError(null);
      setAccuracy(null);
      setLoading(false);
      setPosition(null);
    };
  }, [map, setError, setAccuracy, setLoading, setPosition]);

  // 현재 위치가 있을 때만 마커 렌더링
  if (!currentPosition) return null;

  return (
    <CustomMarker
      key={markerKey.current}
      map={map}
      position={currentPosition}
      heading={heading}
    />
  );
}; 
