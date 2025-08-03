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
  
  const { setError, setAccuracy, setLoading, setPosition } = useGPSStore(state => state.actions);
  const error = useGPSStore(state => state.error);
  const currentPosition = useGPSStore(state => state.position);
  const isLoading = useGPSStore(state => state.isLoading);
  
  // 이동 방향 계산 (도 단위, 0-360)
  const calculateHeading = (prev: kakao.maps.LatLng, current: kakao.maps.LatLng): number => {
    const dy = current.getLat() - prev.getLat();
    const dx = current.getLng() - prev.getLng();
    const rad = Math.atan2(dy, dx);
    const deg = rad * (180 / Math.PI);
    return (deg + 360) % 360;
  };

  // 위치가 변경될 때마다 콜백 호출
  useEffect(() => {
    if (currentPosition) {
      console.log('📍 GPS 위치 업데이트:', {
        lat: currentPosition.getLat(),
        lng: currentPosition.getLng()
      });
      onPositionUpdate?.(currentPosition);
    }
  }, [currentPosition, onPositionUpdate]);

  useEffect(() => {
    console.log('🎯 GPSTracker 초기화 시작');
    console.log('🌐 HTTPS 환경:', window.location.protocol === 'https:');
    console.log('📱 Geolocation 지원:', !!navigator.geolocation);
    
    // 위치 추적 초기화
    const cleanup = initGeolocation(
      map,
      (position) => {
        console.log('✅ 위치 정보 수신 성공:', {
          lat: position.getLat(),
          lng: position.getLng()
        });
        
        // 이동 방향 계산
        if (lastPosition.current) {
          const newHeading = calculateHeading(lastPosition.current, position);
          setHeading(newHeading);
        }
        lastPosition.current = position;
        
        // 위치 업데이트
        setPosition(position);
      },
      (loading) => {
        console.log('🔄 GPS 로딩 상태:', loading);
        setLoading(loading);
      },
      (error) => {
        console.error('❌ GPS 에러 발생:', {
          code: error.code,
          message: error.message
        });
        setError(error);
        const errorMessage = handleGPSError(error);
        toast.error(errorMessage, {
          description: '기본 위치(서울 시청)로 표시됩니다.',
        });
      }
    );

    return () => {
      console.log('🧹 GPSTracker 정리');
      cleanup?.();
      setError(null);
      setAccuracy(null);
      setLoading(false);
      setPosition(null);
    };
  }, [map, setError, setAccuracy, setLoading, setPosition]);

  // 현재 위치가 있을 때만 마커 렌더링
  if (!currentPosition) {
    console.log('📍 현재 위치 없음 - 마커 렌더링 안함');
    return null;
  }

  return (
    <CustomMarker
      map={map}
      position={currentPosition}
      heading={heading}
    />
  );
}; 
