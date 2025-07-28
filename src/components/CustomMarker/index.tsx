import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'lucide-react';
import './styles.css';

// 기본 크기와 스케일 팩터 설정
const BASE_MARKER_SIZE = 24;
const BASE_ICON_SIZE = 16;
const SCALE_FACTOR = 1.1;

// 줌 레벨별 마커 크기 계산
const MARKER_SIZES: Record<number, [number, number]> = Array.from({ length: 9 }, (_, index) => {
  const level = index + 1;
  const scale = Math.pow(SCALE_FACTOR, level - 1);
  const markerSize = Math.round(BASE_MARKER_SIZE * scale);
  const iconSize = Math.round(BASE_ICON_SIZE * scale);
  return [level, [markerSize, iconSize]] as [number, [number, number]];
}).reduce((acc, [level, sizes]) => ({
  ...acc,
  [level.toString()]: sizes
}), {} as Record<number, [number, number]>);

// 줌 레벨에 따른 크기 계산
const getMarkerSize = (level: number): [number, number] => {
  // 범위를 1-9로 제한
  const normalizedLevel = Math.max(1, Math.min(9, level));
  return MARKER_SIZES[normalizedLevel] || MARKER_SIZES[1];
};

interface CustomMarkerProps {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  heading?: number; // 방향 (도 단위, 0-360)
  accuracy?: number; // GPS 정확도 (미터)
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  map,
  position,
  heading = 0,
  accuracy
}) => {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accuracyCircleRef = useRef<kakao.maps.Circle | null>(null);
  const [markerSize, setMarkerSize] = useState<[number, number]>(getMarkerSize(map.getLevel()));

  // 줌 레벨 변경 감지
  useEffect(() => {
    const handleZoomChanged = () => {
      const level = map.getLevel();
      setMarkerSize(getMarkerSize(level));
    };

    // 줌 변경 이벤트 리스너 등록
    map.addListener('zoom_changed', handleZoomChanged);

    return () => {
      // 이벤트 리스너 제거
      map.removeListener('zoom_changed', handleZoomChanged);
    };
  }, [map]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 커스텀 오버레이 생성
    overlayRef.current = new kakao.maps.CustomOverlay({
      position,
      content: containerRef.current,
      map,
      yAnchor: 0.5,
      xAnchor: 0.5,
      zIndex: 3
    });

    // 정확도 표시 원 생성
    if (accuracy) {
      accuracyCircleRef.current = new kakao.maps.Circle({
        center: position,
        radius: accuracy,
        strokeWeight: 1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.3,
        strokeStyle: 'solid',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        map
      });
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null);
      }
    };
  }, [map]);

  // 위치 업데이트
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setPosition(position);
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setCenter(position);
      if (accuracy) {
        accuracyCircleRef.current.setRadius(accuracy);
      }
    }
  }, [position, accuracy]);

  const [markerWidth, iconSize] = markerSize;

  return (
    <div 
      ref={containerRef} 
      className="custom-marker"
      style={{
        width: `${markerWidth}px`,
        height: `${markerWidth}px`
      }}
    >
      <div 
        className="icon-wrapper"
        style={{ 
          transform: `rotate(${heading}deg)`,
          width: `${iconSize}px`,
          height: `${iconSize}px`
        }}
      >
        <Navigation style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
      </div>
    </div>
  );
}; 
